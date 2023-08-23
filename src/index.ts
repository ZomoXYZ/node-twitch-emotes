import { getEmote } from './cache'
import { EmoteData } from './types'
import { highestQuality, isChannelThrow } from './util'

export { ApiResponseTypes, ApiResponseHeaders, ApiResponse } from './api'
export * from './cache'
export * from './types'
export * from './util'

function spliceNativeEmotes(message: string, emotes?: string): (string | EmoteData)[] {
    if (!emotes) return [message]

    const m: (string | EmoteData)[] = []
    var lastChar = 0

    for (const spl of emotes.split('/')) {
        const [id, range] = spl.split(':')
        const [start, end] = range.split('-').map(Number)
        const emote: EmoteData = {
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
        }

        if (lastChar < start) {
            m.push(message.slice(lastChar, start))
        }
        m.push(emote)
        lastChar = end + 1
    }

    if (lastChar < message.length - 1) {
        m.push(message.slice(lastChar))
    }

    return m
}

/**
 *
 * @param callback default callback is `highestQuality`
 * @param withEmotes the `emotes` tag from the twitch message
 * @param strictTwitchEmotes if true, will not check for any native twitch emotes, only the ones in `withEmotes`
 * @returns
 */
export function spliceMessage<T>(
    message: string,
    channel: string,
    callback: (emote: EmoteData) => string | T = highestQuality,
    withEmotes?: string,
    strictTwitchEmotes = false
): (string | T)[] {
    isChannelThrow(channel)

    const messageWithEmotes: (string | EmoteData)[] = spliceNativeEmotes(message, withEmotes)
    const finalMessage: (string | T)[] = []

    for (let part of messageWithEmotes) {
        if (typeof part !== 'string') {
            finalMessage.push(callback(part))
            continue
        }

        var phrase = ''

        while (part.length) {
            const space = part.indexOf(' ')
            const word = part.slice(0, space === -1 ? undefined : space)
            part = space === -1 ? '' : part.slice(space + 1)

            let emote = getEmote(word, channel, strictTwitchEmotes)

            if (!emote) {
                phrase += word
                if (space >= 0) {
                    phrase += ' '
                }
                continue
            }

            if (phrase.length) {
                finalMessage.push(phrase)
            }
            finalMessage.push(callback(emote))
            phrase = space > 0 ? ' ' : ''
        }

        if (phrase.length) finalMessage.push(phrase)
    }

    return finalMessage
}

/**
 *
 * @param callback default callback is `highestQuality`
 * @param withEmotes the `emotes` tag from the twitch message
 * @param strictTwitchEmotes if true, will not check for any native twitch emotes, only the ones in `withEmotes`
 * @returns
 */
export function splitMessage<T>(
    message: string,
    channel: string,
    callback: (emote: EmoteData) => string | T = highestQuality,
    withEmotes?: string,
    strictTwitchEmotes = false
): (string | T)[] {
    isChannelThrow(channel)

    const messageWithEmotes: (string | EmoteData)[] = spliceNativeEmotes(message, withEmotes)
    const finalMessage: (string | T)[] = []

    for (const part of messageWithEmotes) {
        if (typeof part !== 'string') {
            finalMessage.push(callback(part))
            continue
        }

        for (const word of part.split(' ')) {
            if (!word.length) continue

            let emote =
                typeof word === 'string' ? getEmote(word, channel, strictTwitchEmotes) : word

            if (emote) {
                finalMessage.push(callback(emote))
            } else {
                finalMessage.push(word)
            }
        }
    }

    return finalMessage
}
