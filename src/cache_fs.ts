import { access, mkdir, readJson, writeJson } from 'fs-extra'
import { getSetting } from './settings'
import { join } from 'path'
import { ChannelIdentifier, EmoteData } from './types'
import { isChannelThrow, uniqueArr } from './util'

const Dir = (fname?: string) => join(getSetting('cacheDir'), fname || '')

export interface FsResponse<T> {
    data: T
    timestamp: number
}

export async function ensureCacheFolder() {
    try {
        await access(Dir())
    } catch (e) {
        await mkdir(Dir())
    }
}

export async function loadCacheRaw<T = {}>(fileName: string): Promise<T | null> {
    await ensureCacheFolder()

    try {
        await access(Dir(fileName))
    } catch (e) {
        return null
    }

    return await readJson(Dir(fileName))
}

export async function loadCache<T = []>(fileName: string, def: T): Promise<FsResponse<T>> {
    let file = await loadCacheRaw<FsResponse<T>>(fileName)

    if (!file) {
        return { data: def, timestamp: 0 }
    }

    return file
}

async function writeCache(fileName: string, data: any) {
    await ensureCacheFolder()
    await writeJson(Dir(fileName), { data, timestamp: Date.now() })
}

export async function loadChannelList() {
    const data = await loadCache<string[]>(`channels`, [])
    return data.data
}

export async function saveChannelList(channels: string[]) {
    return await writeCache('channels', uniqueArr(channels))
}

export async function loadGlobalCache(): Promise<FsResponse<EmoteData[]>> {
    return loadCache(`global`, [])
}

export async function loadChannelCache(channel: string): Promise<FsResponse<EmoteData[]>> {
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
