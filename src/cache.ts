import { channelEmotes, channelIdentifier, globalEmotes } from './api'
import { ChannelIdentifier, EmoteData } from './types'
import {
    AllChannelDataCollection,
    loadChannels,
    loadGlobalCache,
    saveChannelCache,
    saveGlobalCache,
} from './cache_fs'
import { asyncEach, logRate, repeat } from './util'
import { getSetting, setSettings, SettingsOptions } from './settings'

var GlobalEmotesCache: EmoteData[] = [],
    ChannelEmotesCache: { [channel: string]: EmoteData[] } = {},
    ChannelIdentifiersCache: { [channel: string]: ChannelIdentifier } = {},
    Initiated = false

/**
 *
 * @param channels ensure specific channels are loaded (all cached data will be loaded unless disabled in settings)
 * @returns
 */
export async function initCache(channels: string[] = [], settings: SettingsOptions = {}) {
    if (Initiated) return
    Initiated = true

    channels = channels.map(ch => ch.toLowerCase())

    setSettings(settings)

    let globalTimestamp = 0

    if (getSetting('cache')) {
        const globalData = await loadGlobalCache()
        globalTimestamp = globalData.timestamp
        if (globalData.data.length) {
            GlobalEmotesCache = globalData.data
        }

        const channelsData = await loadChannels()
        if (channelsData) await runChannelData(channelsData)
    }

    await repeat(globalTimestamp, () => reloadGlobalEmotes())
    await asyncEach(channels, chan => repeat(0, () => reloadChannel(chan)))
}

async function runChannelData(channels: AllChannelDataCollection) {
    for (const chan in channels) {
        let timestamp = 0

        const { emotes, identifier } = channels[chan]

        timestamp = Math.min(emotes.timestamp, identifier.timestamp)

        if (emotes.data.length) {
            ChannelEmotesCache[chan] = emotes.data
        }

        if (identifier.data) {
            ChannelIdentifiersCache[chan] = identifier.data
        }

        await repeat(timestamp, () => reloadChannel(chan))
    }
}

export async function reloadGlobalEmotes() {
    const { data: emotes, error, ...rate } = await globalEmotes()
    logRate('global emotes', rate)

    if (!emotes || error) {
        throw new Error(`Error fetching global emotes: ${error || '[unknown error]'}`)
    }

    GlobalEmotesCache = emotes

    if (getSetting('cache')) await saveGlobalCache(GlobalEmotesCache)
}

export async function reloadChannel(channel: string) {
    channel = channel.toLowerCase()

    const { data: emotes, error: emotesErr, ...rateEmotes } = await channelEmotes(channel)
    logRate(`channel emotes     ${channel}`, rateEmotes)

    const { data: identifier, error: idenErr, ...rateIdentifier } = await channelIdentifier(channel)
    logRate(`channel identifier ${channel}`, rateIdentifier)

    if (!emotes || !identifier) {
        let emoteErrStr = emotesErr ? `Emote Error: ${emotesErr}` : ''
        let idenErrStr = idenErr ? `Identifier Error: ${idenErr}` : ''
        let error = `${emoteErrStr}\n${idenErrStr}`.trim()

        if (error.length) error = `\n${error}`
        else error = ': [unknown error]'

        throw new Error(`Error fetching channel data for ${channel}${error}`)
    }

    ChannelEmotesCache[channel] = emotes
    ChannelIdentifiersCache[channel] = identifier

    if (getSetting('cache'))
        await saveChannelCache(
            channel,
            ChannelEmotesCache[channel],
            ChannelIdentifiersCache[channel]
        )
}

export function getChannel(channel: string) {
    channel = channel.toLowerCase()
    return {
        identifier: ChannelIdentifiersCache[channel],
        emotes: ChannelEmotesCache[channel],
    }
}

/**
 * @returns EmoteData: valid
 *
 * null: not an emote
 *
 * false: channel not cached
 */
export function getEmote(emote: string, channel?: string): EmoteData | false | null {
    if (channel) {
        channel = channel.toLowerCase()
        const emotes = ChannelEmotesCache[channel]
        if (emotes) {
            const emoteData = emotes.find(e => e.code === emote)
            if (emoteData) return emoteData
        } else {
            return false
        }
    }

    const globalEmote = GlobalEmotesCache.find(e => e.code === emote)
    if (globalEmote) return globalEmote

    return null
}
