"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.logRate = exports.repeat = exports.repeatBase = exports.asyncEach = exports.highestQuality = exports.uniqueArr = exports.isChannelThrow = exports.correctServices = void 0;
const settings_1 = require("./settings");
function correctServices(services) {
    if (services === 'all') {
        return 'all';
    }
    return services.join('.');
}
exports.correctServices = correctServices;
const isChannel = (channel) => /^[a-zA-Z0-9_]{3,25}$/.test(channel);
const isChannelThrow = (channel) => {
    if (isChannel(channel))
        return channel;
    throw new Error(`Invalid channel name: ${channel}`);
};
exports.isChannelThrow = isChannelThrow;
function uniqueArr(arr) {
    if (Array.isArray(arr)) {
        return [...new Set(arr)];
    }
    else {
        return [arr];
    }
}
exports.uniqueArr = uniqueArr;
const highestQuality = ({ urls }) => urls.length ? urls.sort((a, b) => parseInt(b.size[0]) - parseInt(a.size[0]))[0].url : '';
exports.highestQuality = highestQuality;
const asyncEach = async (arr, callback) => Promise.all(arr.map(callback));
exports.asyncEach = asyncEach;
async function repeatBase(every, starting, once, callback) {
    async function afterTimeout() {
        await callback();
        if (!once)
            setInterval(() => callback(), every);
    }
    let timeout = starting + every - Date.now();
    if (timeout < 0) {
        await afterTimeout();
    }
    else {
        if (!once)
            setTimeout(afterTimeout, timeout);
    }
}
exports.repeatBase = repeatBase;
const repeat = (starting, callback) => repeatBase((0, settings_1.getSetting)('refreshInterval'), starting, !(0, settings_1.getSetting)('autoRefresh'), callback);
exports.repeat = repeat;
const logRate = (type, { limit, remaining, reset }) => {
    if (!(0, settings_1.getSetting)('logApiRate'))
        return;
    if (!limit && !remaining && !reset)
        return;
    console.log(`
RATE: ${type.toUpperCase()}
    limit:     ${limit || 'N/A'}
    remaining: ${remaining || 'N/A'}
    reset:     ${reset || 'N/A'}
`);
};
exports.logRate = logRate;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
//# sourceMappingURL=util.js.map