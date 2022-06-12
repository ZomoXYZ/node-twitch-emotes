"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmote = exports.getChannel = exports.reloadChannel = exports.reloadGlobalEmotes = exports.initCache = void 0;
const api_1 = require("./api");
const cache_fs_1 = require("./cache_fs");
const util_1 = require("./util");
const settings_1 = require("./settings");
var GlobalEmotesCache = [], ChannelEmotesCache = {}, ChannelIdentifiersCache = {}, Initiated = false;
async function initCache(channels = [], settings = {}) {
    if (Initiated)
        return;
    Initiated = true;
    channels = channels.map(ch => ch.toLowerCase());
    (0, settings_1.setSettings)(settings);
    let globalTimestamp = 0;
    if ((0, settings_1.getSetting)('cache')) {
        const globalData = await (0, cache_fs_1.loadGlobalCache)();
        globalTimestamp = globalData.timestamp;
        if (globalData.data.length) {
            GlobalEmotesCache = globalData.data;
        }
        const channelsData = await (0, cache_fs_1.loadChannels)();
        if (channelsData)
            await runChannelData(channelsData);
    }
    await (0, util_1.repeat)(globalTimestamp, () => reloadGlobalEmotes());
    await (0, util_1.asyncEach)(channels, chan => (0, util_1.repeat)(0, () => reloadChannel(chan)));
}
exports.initCache = initCache;
async function runChannelData(channels) {
    for (const chan in channels) {
        let timestamp = 0;
        const { emotes, identifier } = channels[chan];
        timestamp = Math.min(emotes.timestamp, identifier.timestamp);
        if (emotes.data.length) {
            ChannelEmotesCache[chan] = emotes.data;
        }
        if (identifier.data) {
            ChannelIdentifiersCache[chan] = identifier.data;
        }
        await (0, util_1.repeat)(timestamp, () => reloadChannel(chan));
    }
}
async function reloadGlobalEmotes() {
    const { data: emotes, error, ...rate } = await (0, api_1.globalEmotes)();
    (0, util_1.logRate)('global emotes', rate);
    if (!emotes || error) {
        throw new Error(`Error fetching global emotes: ${error || '[unknown error]'}`);
    }
    GlobalEmotesCache = emotes;
    if ((0, settings_1.getSetting)('cache'))
        await (0, cache_fs_1.saveGlobalCache)(GlobalEmotesCache);
}
exports.reloadGlobalEmotes = reloadGlobalEmotes;
async function reloadChannel(channel) {
    channel = channel.toLowerCase();
    const { data: emotes, error: emotesErr, ...rateEmotes } = await (0, api_1.channelEmotes)(channel);
    (0, util_1.logRate)(`channel emotes     ${channel}`, rateEmotes);
    const { data: identifier, error: idenErr, ...rateIdentifier } = await (0, api_1.channelIdentifier)(channel);
    (0, util_1.logRate)(`channel identifier ${channel}`, rateIdentifier);
    if (!emotes || !identifier) {
        let emoteErrStr = emotesErr ? `Emote Error: ${emotesErr}` : '';
        let idenErrStr = idenErr ? `Identifier Error: ${idenErr}` : '';
        let error = `${emoteErrStr}\n${idenErrStr}`.trim();
        if (error.length)
            error = `\n${error}`;
        else
            error = ': [unknown error]';
        throw new Error(`Error fetching channel data for ${channel}${error}`);
    }
    ChannelEmotesCache[channel] = emotes;
    ChannelIdentifiersCache[channel] = identifier;
    if ((0, settings_1.getSetting)('cache'))
        await (0, cache_fs_1.saveChannelCache)(channel, ChannelEmotesCache[channel], ChannelIdentifiersCache[channel]);
}
exports.reloadChannel = reloadChannel;
function getChannel(channel) {
    channel = channel.toLowerCase();
    return {
        identifier: ChannelIdentifiersCache[channel],
        emotes: ChannelEmotesCache[channel],
    };
}
exports.getChannel = getChannel;
function getEmote(emote, channel) {
    if (channel) {
        channel = channel.toLowerCase();
        const emotes = ChannelEmotesCache[channel];
        if (emotes) {
            const emoteData = emotes.find(e => e.code === emote);
            if (emoteData)
                return emoteData;
        }
        else {
            throw new Error(`Channel ${channel} not cached`);
        }
    }
    const globalEmote = GlobalEmotesCache.find(e => e.code === emote);
    if (globalEmote)
        return globalEmote;
    return null;
}
exports.getEmote = getEmote;
//# sourceMappingURL=cache.js.map