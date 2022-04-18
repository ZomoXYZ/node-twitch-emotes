import { ChannelIdentifier, EmoteData } from './types';
export interface FsResponse<T> {
    data: T;
    timestamp: number;
}
export declare function ensureCacheFolder(): Promise<void>;
export declare function loadCacheRaw<T = {}>(fileName: string): Promise<T | null>;
export declare function loadCache<T = []>(fileName: string, def: T): Promise<FsResponse<T>>;
export declare function loadChannelList(): Promise<string[]>;
export declare function saveChannelList(channels: string[]): Promise<void>;
export declare function loadGlobalCache(): Promise<FsResponse<EmoteData[]>>;
export declare function loadChannelCache(channel: string): Promise<FsResponse<EmoteData[]>>;
export declare function loadIdentifierCache(channel: string): Promise<FsResponse<ChannelIdentifier | null>>;
export declare function saveGlobalCache(cache: EmoteData[]): Promise<void>;
export declare function saveChannelCache(channel: string, emotes: EmoteData[], identifier: ChannelIdentifier): Promise<void>;
export interface AllChannelData {
    emotes: FsResponse<EmoteData[]>;
    identifier: FsResponse<ChannelIdentifier | null>;
}
export interface AllChannelDataCollection {
    [channel: string]: AllChannelData;
}
export declare function loadChannels(): Promise<AllChannelDataCollection | null>;
