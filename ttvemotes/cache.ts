import { channelEmotes, channelIdentifier, globalEmotes } from './api'
import { ChannelIdentifier, EmoteData } from './types'
import {
	loadChannels,
	loadGlobalCache,
	saveChannelCache,
	saveGlobalCache,
	saveIdentifierCache,
} from './cache_fs'
import { repeat } from './util'

const RefreshTimeout = 1000 * 60 * 60 * 24 // 1 day

var GlobalEmotesCache: EmoteData[] = [],
	ChannelEmotesCache: { [channel: string]: EmoteData[] } = {},
	ChannelIdentifiersCache: { [channel: string]: ChannelIdentifier } = {}

export async function initCache() {
	const globalData = await loadGlobalCache()

	if (globalData.data.length) {
		GlobalEmotesCache = globalData.data
	}

	//reload global once a day
	repeat(RefreshTimeout, globalData.timestamp, () => reloadGlobalEmotes())

	const channelsData = await loadChannels()

	if (!channelsData) {
		return
	}

	for (const chan in channelsData) {
		const { emotes, identifier } = channelsData[chan]

		if (emotes.data.length) {
			ChannelEmotesCache[chan] = emotes.data
		}

		if (identifier.data) {
			ChannelIdentifiersCache[chan] = identifier.data
		}

		//reload channel emotes once a day
		repeat(RefreshTimeout, emotes.timestamp, () =>
			reloadChannelEmotes(chan)
		)

		//reload identifiers once a day
		repeat(RefreshTimeout, identifier.timestamp, () =>
			reloadChannelIdentifier(chan)
		)
	}
}

export async function reloadGlobalEmotes() {
	const { data: emotes, ...rate } = await globalEmotes()
	console.log(rate)

	GlobalEmotesCache = emotes

	await saveGlobalCache(GlobalEmotesCache)
}

export async function reloadChannelEmotes(channel: string) {
	const { data: emotes, ...rate } = await channelEmotes(channel)
	console.log(rate)

	ChannelEmotesCache[channel] = emotes

	await saveChannelCache(channel, ChannelEmotesCache[channel])
}

export async function reloadChannelIdentifier(channel: string) {
	const { data: identifier, ...rate } = await channelIdentifier(channel)
	console.log(rate)

	ChannelIdentifiersCache[channel] = identifier

	await saveIdentifierCache(channel, ChannelIdentifiersCache[channel])
}

export function getChannel(channel: string) {
	return {
		identifier: ChannelIdentifiersCache[channel],
		emotes: ChannelEmotesCache[channel],
	}
}

export function getEmote(emote: string, channel?: string) {
	if (channel) {
		const emotes = ChannelEmotesCache[channel]
		if (emotes) {
			const emoteData = emotes.find(e => e.code === emote)
			if (emoteData) return emoteData
		}
	}

	const globalEmote = GlobalEmotesCache.find(e => e.code === emote)
	if (globalEmote) return globalEmote

	return null
}
