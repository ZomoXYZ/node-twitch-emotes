"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyChannelEmote = exports.channelIdentifier = exports.channelEmotes = exports.globalEmotes = exports.handleProxyResponse = void 0;
const node_fetch_1 = require("node-fetch");
const util_1 = require("./util");
async function handleResponse(resp) {
    let data = await resp.json();
    return {
        limit: resp.headers.get('X-Ratelimit-Limit'),
        remaining: resp.headers.get('X-Ratelimit-Remaining'),
        reset: resp.headers.get('X-Ratelimit-Reset'),
        data: data.error ? null : data,
    };
}
function handleProxyResponse(resp) {
    return {
        limit: resp.headers.get('X-Ratelimit-Limit'),
        remaining: resp.headers.get('X-Ratelimit-Remaining'),
        reset: resp.headers.get('X-Ratelimit-Reset'),
        data: resp.status === 307 ? resp.url : null,
    };
}
exports.handleProxyResponse = handleProxyResponse;
const globalEmotes = (services = 'all') => (0, node_fetch_1.default)(`https://emotes.adamcy.pl/v1/global/emotes/${(0, util_1.correctServices)(services)}`).then(res => handleResponse(res));
exports.globalEmotes = globalEmotes;
const channelEmotes = (channel, services = 'all') => (0, node_fetch_1.default)(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/emotes/${(0, util_1.correctServices)(services)}`).then(res => handleResponse(res));
exports.channelEmotes = channelEmotes;
const channelIdentifier = (channel) => (0, node_fetch_1.default)(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/id`).then(res => handleResponse(res));
exports.channelIdentifier = channelIdentifier;
const proxyChannelEmote = (channel, services = 'all') => (0, node_fetch_1.default)(`https://emotes.adamcy.pl/v1/channel/${(0, util_1.isChannelThrow)(channel)}/emotes/${(0, util_1.correctServices)(services)}/proxy`).then(res => handleProxyResponse(res));
exports.proxyChannelEmote = proxyChannelEmote;
//# sourceMappingURL=api.js.map