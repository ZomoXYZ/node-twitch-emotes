import { access, mkdir, readJson, writeJson } from 'fs-extra'
import { ChannelIdentifier, EmoteData } from './types'
import { isChannelThrow, uniqueArr } from './util'

export interface FsResponse<T> {
	data: T
	timestamp: number
}

export async function ensureCacheFolder() {
	try {
		await access(`./cache`)
	} catch (e) {
		await mkdir(`./cache`)
	}
}

export async function loadCacheRaw<T = {}>(
	fileName: string
): Promise<T | null> {
	await ensureCacheFolder()

	try {
		console.log('try to read cache', fileName)
		await access(`./cache/${fileName}.json`)
	} catch (e) {
		console.log('failed to read cache', fileName)
		return null
	}
	console.log('successfully read cache', fileName)

	return await readJson(`./cache/${fileName}.json`)
}

export async function loadCache<T = []>(
	fileName: string,
	def: T
): Promise<FsResponse<T>> {
	let file = await loadCacheRaw<FsResponse<T>>(fileName)

	console.log('file', file)

	if (!file) {
		return { data: def, timestamp: 0 }
	}

	return file
}

async function writeCache(fileName: string, data: any) {
	await ensureCacheFolder()
	await writeJson(`./cache/${fileName}.json`, { data, timestamp: Date.now() })
}

export async function loadChannelList() {
	const data = await loadCache<string[]>(`channels`, [])
	return data.data;
}

export async function saveChannelList(channels: string[]) {
	return await writeCache('channels', uniqueArr(channels))
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
	console.log('about to write global cache')
	await writeCache(`global`, cache)
}

// export async function saveChannelCache(channel: string, cache: EmoteData[]) {
// 	isChannelThrow(channel)

// 	await writeCache(`channel.${channel}`, cache)
// }

// export async function saveIdentifierCache(
// 	channel: string,
// 	cache: ChannelIdentifier
// ) {
// 	await writeCache(`identifier.${channel}`, cache)
// }
export async function saveChannelCache(
	channel: string,
	emotes: EmoteData[],
	identifier: ChannelIdentifier
) {
	isChannelThrow(channel)

	await writeCache(`channel.${channel}`, emotes)
	await writeCache(`identifier.${channel}`, identifier)

	let channels = await loadChannelList()
	if (!channels.includes(channel)) {
		channels.push(channel)
		await saveChannelList(channels)
	}
}

export interface AllChannelData {
	emotes: FsResponse<EmoteData[]>
	identifier: FsResponse<ChannelIdentifier | null>
}

export interface AllChannelDataCollection {
	[channel: string]: AllChannelData
}

export async function loadChannels(): Promise<AllChannelDataCollection | null> {
	const channels = await loadChannelList()

	console.log('channels', channels)

	let foundData: AllChannelDataCollection = {}

	if (!channels.length) {
		return null
	} else {
		for (const chan of uniqueArr(channels)) {
			foundData[chan] = {
				emotes: await loadChannelCache(chan),
				identifier: await loadIdentifierCache(chan),
			}
		}

		return foundData
	}
}
