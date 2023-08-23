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
exports.splitMessage = exports.spliceMessage = void 0;
const cache_1 = require("./cache");
const util_1 = require("./util");
__exportStar(require("./cache"), exports);
__exportStar(require("./types"), exports);
__exportStar(require("./util"), exports);
function spliceNativeEmotes(message, emotes) {
    if (!emotes)
        return [message];
    const m = [];
    var lastChar = 0;
    for (const spl of emotes.split('/')) {
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
        if (lastChar < start) {
            m.push(message.slice(lastChar, start));
        }
        m.push(emote);
        lastChar = end + 1;
    }
    if (lastChar < message.length - 1) {
        m.push(message.slice(lastChar));
    }
    return m;
}
function spliceMessage(message, channel, callback = util_1.highestQuality, withEmotes, strictTwitchEmotes = false) {
    (0, util_1.isChannelThrow)(channel);
    const messageWithEmotes = spliceNativeEmotes(message, withEmotes);
    const finalMessage = [];
    for (let part of messageWithEmotes) {
        if (typeof part !== 'string') {
            finalMessage.push(callback(part));
            continue;
        }
        var phrase = '';
        while (part.length) {
            const space = part.indexOf(' ');
            const word = part.slice(0, space === -1 ? undefined : space);
            part = space === -1 ? '' : part.slice(space + 1);
            let emote = (0, cache_1.getEmote)(word, channel, strictTwitchEmotes);
            if (!emote) {
                phrase += word;
                if (space >= 0) {
                    phrase += ' ';
                }
                continue;
            }
            if (phrase.length) {
                finalMessage.push(phrase);
            }
            finalMessage.push(callback(emote));
            phrase = space > 0 ? ' ' : '';
        }
        if (phrase.length)
            finalMessage.push(phrase);
    }
    return finalMessage;
}
exports.spliceMessage = spliceMessage;
function splitMessage(message, channel, callback = util_1.highestQuality, withEmotes, strictTwitchEmotes = false) {
    (0, util_1.isChannelThrow)(channel);
    const messageWithEmotes = spliceNativeEmotes(message, withEmotes);
    const finalMessage = [];
    for (const part of messageWithEmotes) {
        if (typeof part !== 'string') {
            finalMessage.push(callback(part));
            continue;
        }
        for (const word of part.split(' ')) {
            if (!word.length)
                continue;
            let emote = typeof word === 'string' ? (0, cache_1.getEmote)(word, channel, strictTwitchEmotes) : word;
            if (emote) {
                finalMessage.push(callback(emote));
            }
            else {
                finalMessage.push(word);
            }
        }
    }
    return finalMessage;
}
exports.splitMessage = splitMessage;
//# sourceMappingURL=index.js.map