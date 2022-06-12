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
function spliceMessage(message, channel, callback = util_1.highestQuality) {
    const messageSpl = message.split(' '), arr = [];
    for (let i = 0; i < messageSpl.length; i++) {
        const word = messageSpl[i];
        let emote = (0, cache_1.getEmote)(word, channel);
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