import { getEmote, initChannelsCache, initGlobalsCache, initIdentifiersCache } from './cache';
import { EmoteData } from './types';

export {
    ApiResponseTypes,
    ApiResponse
} from './api';
export {
    getEmote,
    reloadIdentifiersCache,
    reloadGlobalsCache,
    reloadChannelsCache
} from './cache'
export * from './types';
export * from './util';

export function spliceMessage<T>(message: string, channel: string, callback: (emote: EmoteData) => T) {

    const messageSpl: string[] = message.split(' '),
        arr: (string | T)[] = [];

    for (let i = 0; i < messageSpl.length; i++) {

        const word = messageSpl[i];

        let emote = getEmote(word, channel);

        if (emote) {
            arr[i] = callback(emote);
        } else {
            arr[i] = word;
        }

    }

    return arr;

}

export function initAll() {
    initIdentifiersCache();
    initGlobalsCache();
    initChannelsCache();
}