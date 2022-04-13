import { access, readJson, writeJson } from 'fs-extra'
import { ChannelIdentifier, EmoteData } from './types'
import { isChannelThrow, uniqueArr } from './util'

export interface FsResponse<T> {
	data: T
	timestamp: number
}

export async function loadCacheRaw<T = {}>(
	fileName: string
): Promise<T | null> {
	try {
		await access(`./cache/${fileName}.json`)
	} catch (e) {
		return null
	}

	return await readJson(`./cache/${fileName}.json`)
}

export async function loadCache<T = []>(
	fileName: string,
	def: T
): Promise<FsResponse<T>> {
	let file = await loadCacheRaw<FsResponse<T>>(fileName)

	if (!file) {
		return { data: def, timestamp: 0 }
	}

	return file
}

async function writeCache(fileName: string, data: any) {
	await writeJson(`./cache/${fileName}.json`, { data, timestamp: Date.now() })
}

export async function loadGlobalCache(): Promise<FsResponse<EmoteData[]>> {
	return loadCache(`global`, [])
}

export async function loadChannelCache(
	channel: string
): Promise<FsResponse<EmoteData[]>> {
	isChannelThrow(channel)

	return loadCache(`channel.${channel}`, [])
}

export async function loadIdentifierCache(
	channel: string
): Promise<FsResponse<ChannelIdentifier | null>> {
	return loadCache(`identifier.${channel}`, null)
}

export async function saveGlobalCache(cache: EmoteData[]) {
	await writeCache(`global`, cache)
}

export async function saveChannelCache(channel: string, cache: EmoteData[]) {
	isChannelThrow(channel)

	await writeCache(`channel.${channel}`, cache)
}

export async function saveIdentifierCache(
	channel: string,
	cache: ChannelIdentifier
) {
	await writeCache(`identifier.${channel}`, cache)
}

export interface AllChannelData {
	emotes: FsResponse<EmoteData[]>
	identifier: FsResponse<ChannelIdentifier | null>
}

export interface AllChannelDataCollection {
	[channel: string]: AllChannelData
}

export async function loadChannels(): Promise<AllChannelDataCollection | null> {
	const data = await loadCacheRaw<{ channels: string[] }>(`channels`)

	let foundData: AllChannelDataCollection = {}

	if (!data) {
		return null
	} else {
		for (const chan of uniqueArr(data.channels)) {
			foundData[chan] = {
				emotes: await loadChannelCache(chan),
				identifier: await loadIdentifierCache(chan),
			}
		}

		return foundData
	}
}
