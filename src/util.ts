import { EmoteData } from './types'

export type ServicesEach = 'twitch' | '7tv' | 'bttv' | 'ffz'
export type Services = 'all' | ServicesEach[]

export function correctServices(services: Services): string {
    if (services === 'all') {
        return 'all'
    }

    return services.join('.')
}

export const isChannel = (channel: string) => /^[a-zA-Z0-9_]{4,25}$/.test(channel)

export const isChannelThrow = (channel: string) => {
    if (isChannel(channel)) return channel
    throw `Invalid channel name: ${channel}`
}

export function uniqueArr<T>(arr: T | T[]): T[] {
    if (Array.isArray(arr)) {
        return [...new Set(arr)]
    } else {
        return [arr]
    }
}

export const highestQuality = ({ urls }: EmoteData) =>
    urls.length ? urls.sort((a, b) => parseInt(b.size[0]) - parseInt(a.size[0]))[0].url : ''

export function repeat(every: number, starting: number, callback: () => void) {
    function afterTimeout() {
        callback()
        setInterval(() => callback(), every)
    }

    let timeout = starting + every - Date.now()
    if (timeout < 0) {
        afterTimeout()
    } else {
        setTimeout(afterTimeout, timeout)
    }
}
