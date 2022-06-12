import { getEmote } from './cache'
import { EmoteData } from './types'
import { highestQuality, isChannelThrow } from './util'

export { ApiResponseTypes, ApiResponseHeaders, ApiResponse } from './api'
export * from './cache'
export * from './types'
export * from './util'

/**
 *
 * @param callback default callback is `highestQuality`
 * @returns
 */
export function spliceMessage<T>(
    message: string,
    channel: string,
    callback: (emote: EmoteData) => string | T = highestQuality
): (string | T)[] {
    isChannelThrow(channel)

    const messageSpl: string[] = message.split(' '),
        arr: (string | T)[] = []

    for (let i = 0; i < messageSpl.length; i++) {
        const word = messageSpl[i]

        let emote = getEmote(word, channel)

        if (emote) {
            arr[i] = callback(emote)
        } else {
            arr[i] = word
        }
    }

    return arr
}
