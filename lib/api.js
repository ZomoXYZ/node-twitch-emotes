"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyChannelEmote = exports.channelIdentifier = exports.channelEmotes = exports.globalEmotes = void 0;
const settings_1 = require("./settings");
const util_1 = require("./util");
async function handleResponse(url, retryCount = 0, prevHeaders) {
    if (retryCount && prevHeaders && retryCount > (0, settings_1.getSetting)('maxRetryRateLimit')) {
        return {
            ...prevHeaders,
            data: null,
            error: 'Rate limit exceeded',
        };
    }
    let res = await fetch(url);
    let code = res.status;
    let data = await res.json();
    let error = null;
    if (code === 429) {
        let retry = res.headers.get('Retry-After') || '20';
        let time = parseInt(retry) * 1000;
        await (0, util_1.sleep)(time);
        return handleResponse(url, ++retryCount, {
            limit: res.headers.get('X-Ratelimit-Limit'),
            remaining: res.headers.get('X-Ratelimit-Remaining'),
            reset: res.headers.get('X-Ratelimit-Reset'),
        });
    }
    else if (code === 400 || 'error' in data) {
        error = data.error;
    }
    return {
        limit: res.headers.get('X-Ratelimit-Limit'),
        remaining: res.headers.get('X-Ratelimit-Remaining'),
        reset: res.headers.get('X-Ratelimit-Reset'),
        data: error ? null : data,
        error,
    };
}
async function handleProxyResponse(url) {
    let res = await fetch(url);
    return {
        limit: res.headers.get('X-Ratelimit-Limit'),
        remaining: res.headers.get('X-Ratelimit-Remaining'),
        reset: res.headers.get('X-Ratelimit-Reset'),
        data: res.status === 307 ? res.url : null,
        error: null,
    };
}
const globalEmotes = (services = 'all') => handleResponse(`https://emotes.adamcy.pl/v1/global/emotes/${(0, util_1.correctServices)(services)}`);
exports.globalEmotes = globalEmotes;
const channelEmotes = (channel, services = 'all') => handleResponse(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/emotes/${(0, util_1.correctServices)(services)}`);
exports.channelEmotes = channelEmotes;
const channelIdentifier = (channel) => handleResponse(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/id`);
exports.channelIdentifier = channelIdentifier;
const proxyChannelEmote = (channel, services = 'all') => handleProxyResponse(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/emotes/${(0, util_1.correctServices)(services)}/proxy`);
exports.proxyChannelEmote = proxyChannelEmote;
//# sourceMappingURL=api.js.map