import { ApiResponseHeaders } from './api'
import { getSetting } from './settings'
import { EmoteData } from './types'

export type ServicesEach = 'twitch' | '7tv' | 'bttv' | 'ffz'
export type Services = 'all' | ServicesEach[]

export function correctServices(services: Services): string {
    if (services === 'all') {
        return 'all'
    }

    return services.join('.')
}

export const isChannel = (channel: string) => /^[a-zA-Z0-9_]{3,25}$/.test(channel)

export const isChannelThrow = (channel: string) => {
    if (isChannel(channel)) return channel
    throw new Error(`Invalid channel name: ${channel}`)
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

export const asyncEach = async <T>(arr: T[], callback: (item: T) => Promise<void>) =>
    Promise.all(arr.map(callback))

export async function repeatBase(
    every: number,
    starting: number,
    once: boolean,
    callback: () => void | Promise<void>
) {
    async function afterTimeout() {
        await callback()
        if (!once) setInterval(() => callback(), every)
    }

    let timeout = starting + every - Date.now()
    if (timeout < 0) {
        await afterTimeout()
    } else {
        if (!once) setTimeout(afterTimeout, timeout)
    }
}

export const repeat = (starting: number, callback: () => void) =>
    repeatBase(getSetting('refreshInterval'), starting, !getSetting('autoRefresh'), callback)

export const logRate = (type: string, { limit, remaining, reset }: ApiResponseHeaders) => {
    if (!getSetting('logApiRate')) return
    if (!limit && !remaining && !reset) return

    console.log(`
RATE: ${type.toUpperCase()}
    limit:     ${limit || 'N/A'}
    remaining: ${remaining || 'N/A'}
    reset:     ${reset || 'N/A'}
`)
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
