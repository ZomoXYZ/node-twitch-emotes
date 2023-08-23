"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spliceMessage = void 0;
const cache_1 = require("./cache");
const util_1 = require("./util");
__exportStar(require("./cache"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./util"), exports);
function spliceMessage(message, channel, callback = util_1.highestQuality, withEmtoes) {
    (0, util_1.isChannelThrow)(channel);
    var messageSpl = message.split(' '), arr = [];
    if (withEmtoes) {
        messageSpl = [];
        var lastChar = 0;
        withEmtoes.split('/').forEach(spl => {
            const [id, range] = spl.split(':');
            const [start, end] = range.split('-').map(Number);
            const emote = {
                provider: 0,
                code: message.slice(start, end + 1),
                urls: [
                    {
                        size: '1x',
                        url: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/1.0`,
                    },
                    {
                        size: '2x',
                        url: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/2.0`,
                    },
                    {
                        size: '3x',
                        url: `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`,
                    },
                ],
            };
            messageSpl.push(...message.slice(lastChar, start).split(' '));
            if (messageSpl.at(-1) === '')
                messageSpl.pop();
            messageSpl.push(emote);
            lastChar = end + 1;
            if (message[end + 1] === ' ')
                lastChar++;
        });
        messageSpl.push(...message.slice(lastChar).split(' '));
        if (messageSpl.at(-1) === '')
            messageSpl.pop();
    }
    for (let i = 0; i < messageSpl.length; i++) {
        const word = messageSpl[i];
        let emote = typeof word === 'string' ? (0, cache_1.getEmote)(word, channel) : word;
        if (emote) {
            arr[i] = callback(emote);
        }
        else {
            arr[i] = word;
        }
    }
    return arr;
}
exports.spliceMessage = spliceMessage;
//# sourceMappingURL=index.js.map