"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadChannels = exports.saveChannelCache = exports.saveGlobalCache = exports.loadIdentifierCache = exports.loadChannelCache = exports.loadGlobalCache = exports.saveChannelList = exports.loadChannelList = exports.loadCache = exports.loadCacheRaw = exports.ensureCacheFolder = void 0;
const fs_extra_1 = require("fs-extra");
const settings_1 = require("./settings");
const path_1 = require("path");
const util_1 = require("./util");
const Dir = (fname) => (0, path_1.join)((0, settings_1.getSetting)('cacheDir'), fname || '');
async function ensureCacheFolder() {
    try {
        await (0, fs_extra_1.access)(Dir());
    }
    catch (e) {
        await (0, fs_extra_1.mkdir)(Dir());
    }
}
exports.ensureCacheFolder = ensureCacheFolder;
async function loadCacheRaw(fileName) {
    await ensureCacheFolder();
    try {
        await (0, fs_extra_1.access)(Dir(fileName));
    }
    catch (e) {
        return null;
    }
    return await (0, fs_extra_1.readJson)(Dir(fileName));
}
exports.loadCacheRaw = loadCacheRaw;
async function loadCache(fileName, def) {
    let file = await loadCacheRaw(fileName);
    if (!file) {
        return { data: def, timestamp: 0 };
    }
    return file;
}
exports.loadCache = loadCache;
async function writeCache(fileName, data) {
    await ensureCacheFolder();
    await (0, fs_extra_1.writeJson)(Dir(fileName), { data, timestamp: Date.now() });
}
async function loadChannelList() {
    const data = await loadCache(`channels`, []);
    return data.data;
}
exports.loadChannelList = loadChannelList;
async function saveChannelList(channels) {
    return await writeCache('channels', (0, util_1.uniqueArr)(channels));
}
exports.saveChannelList = saveChannelList;
async function loadGlobalCache() {
    return loadCache(`global`, []);
}
exports.loadGlobalCache = loadGlobalCache;
async function loadChannelCache(channel) {
    (0, util_1.isChannelThrow)(channel);
    return loadCache(`channel.${channel}`, []);
}
exports.loadChannelCache = loadChannelCache;
async function loadIdentifierCache(channel) {
    return loadCache(`identifier.${channel}`, null);
}
exports.loadIdentifierCache = loadIdentifierCache;
async function saveGlobalCache(cache) {
    await writeCache(`global`, cache);
}
exports.saveGlobalCache = saveGlobalCache;
async function saveChannelCache(channel, emotes, identifier) {
    (0, util_1.isChannelThrow)(channel);
    await writeCache(`channel.${channel}`, emotes);
    await writeCache(`identifier.${channel}`, identifier);
    let channels = await loadChannelList();
    if (!channels.includes(channel)) {
        channels.push(channel);
        await saveChannelList(channels);
    }
}
exports.saveChannelCache = saveChannelCache;
async function loadChannels() {
    const channels = await loadChannelList();
    let foundData = {};
    if (!channels.length) {
        return null;
    }
    else {
        for (const chan of (0, util_1.uniqueArr)(channels)) {
            foundData[chan] = {
                emotes: await loadChannelCache(chan),
                identifier: await loadIdentifierCache(chan),
            };
        }
        return foundData;
    }
}
exports.loadChannels = loadChannels;
//# sourceMappingURL=cache_fs.js.map