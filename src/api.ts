import fetch, { Response } from 'node-fetch'
import { getSetting } from './settings'
import { ChannelIdentifier, EmoteData } from './types'
import { correctServices, isChannelThrow, Services, sleep } from './util'

export type ApiResponseTypes = ChannelIdentifier | EmoteData[]

export interface ApiResponseHeaders {
    limit: string | null
    remaining: string | null
    reset: string | null
}
export interface ApiResponse<T> extends ApiResponseHeaders {
    data: T | null
    error: string | null
}

/**
 * @returns ApiResponse or false
 *
 * false means the request was rate limited, and the time remaining has
 */
async function handleResponse<T>(
    url: string,
    retryCount: number = 0,
    prevHeaders?: ApiResponseHeaders
): Promise<ApiResponse<T>> {
    if (retryCount && prevHeaders && retryCount > getSetting('maxRetryRateLimit')) {
        return {
            ...prevHeaders,
            data: null,
            error: 'Rate limit exceeded',
        }
    }

    let res = await fetch(url)
    let code = res.status
    let data = await res.json()
    let error = null

    if (code === 429) {
        //rate limited
        let retry = res.headers.get('Retry-After') || '20' //20 seconds is the max rate limit time
        let time = parseInt(retry) * 1000
        await sleep(time)
        return handleResponse(url, ++retryCount, {
            limit: res.headers.get('X-Ratelimit-Limit'),
            remaining: res.headers.get('X-Ratelimit-Remaining'),
            reset: res.headers.get('X-Ratelimit-Reset'),
        })
    } else if (code === 400 || 'error' in data) {
        error = data.error
    }

    return {
        limit: res.headers.get('X-Ratelimit-Limit'),
        remaining: res.headers.get('X-Ratelimit-Remaining'),
        reset: res.headers.get('X-Ratelimit-Reset'),
        data: error ? null : data,
        error,
    }
}

/**
 * @returns \{ data }: url to the emote image, or null if not found
 */
async function handleProxyResponse(url: string): Promise<ApiResponse<string>> {
    let res = await fetch(url)

    return {
        limit: res.headers.get('X-Ratelimit-Limit'),
        remaining: res.headers.get('X-Ratelimit-Remaining'),
        reset: res.headers.get('X-Ratelimit-Reset'),
        data: res.status === 307 ? res.url : null,
        error: null,
    }
}

/**
 * Returns global emotes
 * @param services Possible values: all or any combination of: twitch, 7tv, bttv, ffz combined using dots (e.g. twitch.7tv)
 *
 * Math pattern `/^[^\.]+(all|(\.?twitch|\.?7tv|\.?bttv|\.?ffz)+)$/`
 */
export const globalEmotes = (services: Services = 'all'): Promise<ApiResponse<EmoteData[]>> =>
    handleResponse<EmoteData[]>(
        `https://emotes.adamcy.pl/v1/global/emotes/${correctServices(services)}`
    )

/**
 * Returns channel emotes
 * @param channel It's recommended to provide twitch id, but twitch login is also supported
 * @param services Possible values: all or any combination of: twitch, 7tv, bttv, ffz combined using dots (e.g. twitch.7tv)
 *
 * Math pattern `/^[^\.]+(all|(\.?twitch|\.?7tv|\.?bttv|\.?ffz)+)$/`
 */
export const channelEmotes = (
    channel: string,
    services: Services = 'all'
): Promise<ApiResponse<EmoteData[]>> =>
    handleResponse<EmoteData[]>(
        `https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/emotes/${correctServices(
            services
        )}`
    )

/**
 * Returns basic identifiers (id, login, display name)
 * @param channel It's recommended to provide twitch id, but twitch login is also supported
 */
export const channelIdentifier = (channel: string): Promise<ApiResponse<ChannelIdentifier>> =>
    handleResponse<ChannelIdentifier>(
        `https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/id`
    )

/**
 * Proxies directly to emote's URL.
 *
 * This proxy can find a bunch of use-cases. One of them could be a simple img element, where you don't need to fetch, parse and extract the right emote URL on your own.
 *
 * To prevent flooding API with requests, each emote fetched thru proxy endpoint will be cached for 7 days by the browser.
 * @param channel It's recommended to provide twitch id, but twitch login is also supported
 * @param services Possible values: all or any combination of: twitch, 7tv, bttv, ffz combined using dots (e.g. twitch.7tv)
 */
export const proxyChannelEmote = (
    channel: string,
    services: Services = 'all'
): Promise<ApiResponse<string | null>> =>
    handleProxyResponse(
        `https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/emotes/${correctServices(
            services
        )}/proxy`
    )
