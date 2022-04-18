import fetch, { Response } from 'node-fetch'
import { ChannelIdentifier, EmoteData } from './types'
import { correctServices, isChannelThrow, Services } from './util'

//TODO use node-fetch
// declare function fetch(url: string): Promise<Response>

export type ApiResponseTypes = ChannelIdentifier | EmoteData[]

export interface ApiResponseHeaders {
    limit: string | null
    remaining: string | null
    reset: string | null
}
export interface ApiResponse<T> extends ApiResponseHeaders {
    data: T | null
}

async function handleResponse<T>(resp: Response): Promise<ApiResponse<T>> {
    let data = await resp.json()

    return {
        limit: resp.headers.get('X-Ratelimit-Limit'),
        remaining: resp.headers.get('X-Ratelimit-Remaining'),
        reset: resp.headers.get('X-Ratelimit-Reset'),
        data: data.error ? null : data,
    }
}

/**
 * @returns \{ data }: url to the emote image, or null if not found
 */
export function handleProxyResponse(resp: Response): ApiResponse<string> {
    return {
        limit: resp.headers.get('X-Ratelimit-Limit'),
        remaining: resp.headers.get('X-Ratelimit-Remaining'),
        reset: resp.headers.get('X-Ratelimit-Reset'),
        data: resp.status === 307 ? resp.url : null,
    }
}

/**
 * Returns global emotes
 * @param services Possible values: all or any combination of: twitch, 7tv, bttv, ffz combined using dots (e.g. twitch.7tv)
 *
 * Math pattern `/^[^\.]+(all|(\.?twitch|\.?7tv|\.?bttv|\.?ffz)+)$/`
 */
export const globalEmotes = (services: Services = 'all'): Promise<ApiResponse<EmoteData[]>> =>
    fetch(`https://emotes.adamcy.pl/v1/global/emotes/${correctServices(services)}`).then(res =>
        handleResponse<EmoteData[]>(res)
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
    fetch(
        `https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/emotes/${correctServices(
            services
        )}`
    ).then(res => handleResponse<EmoteData[]>(res))

/**
 * Returns basic identifiers (id, login, display name)
 * @param channel It's recommended to provide twitch id, but twitch login is also supported
 */
export const channelIdentifier = (channel: string): Promise<ApiResponse<ChannelIdentifier>> =>
    fetch(`https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/id`).then(res =>
        handleResponse<ChannelIdentifier>(res)
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
    fetch(
        `https://emotes.adamcy.pl/v1/channel/${isChannelThrow(channel)}/emotes/${correctServices(
            services
        )}/proxy`
    ).then(res => handleProxyResponse(res))
