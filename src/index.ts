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
 * @param withEmtoes the `emotes` tag from the twitch message
 * @returns
 */
export function spliceMessage<T>(
    message: string,
    channel: string,
    callback: (emote: EmoteData) => string | T = highestQuality,
    withEmtoes?: string
): (string | T)[] {
    isChannelThrow(channel)

    var messageSpl: (string | EmoteData)[] = message.split(' '),
        arr: (string | T)[] = []

    if (withEmtoes) {
        messageSpl = []
        var lastChar = 0

        withEmtoes.split('/').forEach(spl => {
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

            messageSpl.push(...message.slice(lastChar, start).split(' '))
            if (messageSpl.at(-1) === '') messageSpl.pop()

            messageSpl.push(emote)

            lastChar = end + 1
            if (message[end + 1] === ' ') lastChar++
        })

        messageSpl.push(...message.slice(lastChar).split(' '))
        if (messageSpl.at(-1) === '') messageSpl.pop()
    }

    for (let i = 0; i < messageSpl.length; i++) {
        const word = messageSpl[i]

        let emote = typeof word === 'string' ? getEmote(word, channel) : word

        if (emote) {
            arr[i] = callback(emote)
        } else {
            arr[i] = word as string // this is logically a string
        }
    }

    return arr
}
