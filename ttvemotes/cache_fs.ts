import { access, readJson, writeJson } from 'fs-extra';
import { ChannelIdentifier, EmoteData } from './types';
import { isChannelThrow } from './util';

async function loadCache(fileName: string) {

    try {
        await access(`./cache/${fileName}.json`);

    } catch(e) {
        await writeJson(`./cache/${fileName}.json`, { data: [] });
        return [];
    }

    let { data, timestamp } = await readJson(`./cache/${fileName}.json`);

    //once a day
    if (timestamp + (1000 * 60 * 60 * 24) < new Date().getTime()) {
        //todo trigger flag to reload cache
    }

    return data;

}

async function writeCache(fileName: string, data: any[]) {

    await writeJson(`./cache/${fileName}.json`, { data, timestamp: new Date().getTime() });

}

export async function loadIdentifiersCache(): Promise<ChannelIdentifier[]> {

    return loadCache(`identifiers`);
    
}

export async function saveIdentifiersCache(cache: ChannelIdentifier[]) {

    await writeCache(`identifiers`, cache);

}

export async function loadChannels(): Promise<string[]> {

    return loadCache(`channels`);
    
}

export async function saveChannels(cache: string[]) {

    await writeCache(`channels`, cache);
}

export async function loadChannelCache(channel: string): Promise<EmoteData[]> {

    isChannelThrow(channel);

    return loadCache(`channel.${channel}`);
    
}

export async function saveChannelCache(channel: string, cache: EmoteData[]) {

    isChannelThrow(channel);

    await writeCache(`channel.${channel}`, cache);
}

export async function loadGlobalCache(): Promise<EmoteData[]> {

    return loadCache(`global`);
    
}

export async function saveGlobalCache(cache: EmoteData[]) {

    await writeCache(`global`, cache);

}