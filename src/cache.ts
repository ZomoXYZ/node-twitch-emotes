import { channelEmotes, channelIdentifier, globalEmotes } from './api'
import { ChannelIdentifier, EmoteData, SettingsOptions } from './types'
import { loadChannels, loadGlobalCache, saveChannelCache, saveGlobalCache } from './cache_fs'
import { repeat } from './util'

const RefreshTimeout = 1000 * 60 * 60 * 24 // 1 day

var GlobalEmotesCache: EmoteData[] = [],
    ChannelEmotesCache: { [channel: string]: EmoteData[] } = {},
    ChannelIdentifiersCache: { [channel: string]: ChannelIdentifier } = {},
	Initiated = false

const Settings = {
	autoRefresh: true
}

function setSettings(adjustSettings: SettingsOptions) {
	if (adjustSettings.autoRefresh !== undefined) {
		Settings.autoRefresh = adjustSettings.autoRefresh
	}
}

/**
 *
 * @param channels ensure specific channels are loaded
 * @returns
 */
export async function initCache(channels: string[] = [], settings: SettingsOptions = {}) {
    if (Initiated) return
    Initiated = true

	setSettings(settings);

    const globalData = await loadGlobalCache()

    if (globalData.data.length) {
        GlobalEmotesCache = globalData.data
    }

    //reload global once a day
    if (Settings.autoRefresh)
        repeat(RefreshTimeout, globalData.timestamp, () => reloadGlobalEmotes())

    const channelsData = await loadChannels()

    let foundChannels: string[] = []
    if (channelsData) foundChannels = Object.keys(channelsData)

    const allChannels = [...foundChannels, ...channels]

    for (const chan of allChannels) {
        let timestamp = 0

        if (channelsData && chan in channelsData) {
            const { emotes, identifier } = channelsData[chan]

            timestamp = Math.min(emotes.timestamp, identifier.timestamp)

            if (emotes.data.length) {
                ChannelEmotesCache[chan] = emotes.data
            }

            if (identifier.data) {
                ChannelIdentifiersCache[chan] = identifier.data
            }
        }

        //reload channel data once a day
        if (Settings.autoRefresh) repeat(RefreshTimeout, timestamp, () => reloadChannel(chan))
    }
}

export async function reloadGlobalEmotes() {
    const { data: emotes, ...rate } = await globalEmotes()
    console.log('RATE', 'global emotes', rate)

    if (!emotes) {
        throw `Error fetching global emotes`
    }

    GlobalEmotesCache = emotes

    await saveGlobalCache(GlobalEmotesCache)
}

export async function reloadChannel(channel: string) {
    const { data: emotes, ...rateEmotes } = await channelEmotes(channel)
    const { data: identifier, ...rateIdentifier } = await channelIdentifier(channel)
    console.log('RATE', 'emotes', rateEmotes, 'identifier', rateIdentifier)

    if (!emotes || !identifier) {
        throw `Error fetching channel data for ${channel}`
    }

    ChannelEmotesCache[channel] = emotes
    ChannelIdentifiersCache[channel] = identifier

    await saveChannelCache(channel, ChannelEmotesCache[channel], ChannelIdentifiersCache[channel])
}

export function getChannel(channel: string) {
    return {
        identifier: ChannelIdentifiersCache[channel],
        emotes: ChannelEmotesCache[channel],
    }
}

/**
 *
 * @returns EmoteData: valid
 *
 * null: not an emote
 *
 * false: channel not cached
 */
export function getEmote(emote: string, channel?: string): EmoteData | false | null {
    if (channel) {
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
