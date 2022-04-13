import { channelEmotes, channelIdentifier, globalEmotes } from "./api";
import { ChannelIdentifier, EmoteData } from "./types";
import { loadChannelCache, loadChannels, loadGlobalCache, loadIdentifiersCache, saveChannelCache, saveGlobalCache, saveIdentifiersCache } from "./cache_fs";
import { uniqueArr } from "./util";

var ChannelIdentifiersCache: ChannelIdentifier[] = [],
    GlobalEmotesCache: EmoteData[] = [],
    ChannelEmotesCache: { [channel: string]: EmoteData[] } = {};

export async function initIdentifiersCache() {
    const identifiers =  await loadIdentifiersCache();
    ChannelIdentifiersCache = identifiers;
}

export async function initGlobalsCache() {
    const emotes =  await loadGlobalCache();
    GlobalEmotesCache = emotes;
}

export async function initChannelsCache() {

    const channels = await loadChannels();

    for (const chan of uniqueArr(channels))
        ChannelEmotesCache[chan] = await loadChannelCache(chan);

}

export async function reloadIdentifiersCache(channels: string | string[]) {

    for (const chan of uniqueArr(channels)) {

        const { data: identifier, ...rate} = await channelIdentifier(chan);
        console.log(rate);

        if (ChannelIdentifiersCache.some(i => i.login === chan.toLowerCase())) {
            const index = ChannelIdentifiersCache.findIndex(i => i.login === chan.toLowerCase());
            ChannelIdentifiersCache[index] = identifier;
        } else {
            ChannelIdentifiersCache.push(identifier);
        }

    }

    await saveIdentifiersCache(ChannelIdentifiersCache);

}

export async function reloadGlobalsCache() {

    const { data: emotes, ...rate} = await globalEmotes();
    console.log(rate);

    GlobalEmotesCache = emotes;

    await saveGlobalCache(GlobalEmotesCache);
    
}

export async function reloadChannelsCache(channels: string | string[]) {

    for (const chan of uniqueArr(channels)) {

        const { data: emotes, ...rate} = await channelEmotes(chan);
        console.log(rate);

        ChannelEmotesCache[chan] = emotes;

        await saveChannelCache(chan, ChannelEmotesCache[chan]);

    }

}

export function getEmote(emote: string, channel?: string) {

    if (channel) {
        const emotes = ChannelEmotesCache[channel];
        if (emotes) {
            const emoteData = emotes.find(e => e.code === emote);
            if (emoteData)
                return emoteData;
        }
    }

    const globalEmote = GlobalEmotesCache.find(e => e.code === emote);
    if (globalEmote)
        return globalEmote;

    return null;

}