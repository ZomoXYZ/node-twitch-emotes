import { ChannelIdentifier, EmoteData } from './types';
import { Services } from './util';
export declare type ApiResponseTypes = ChannelIdentifier | EmoteData[];
export interface ApiResponseHeaders {
    limit: string | null;
    remaining: string | null;
    reset: string | null;
}
export interface ApiResponse<T> extends ApiResponseHeaders {
    data: T | null;
    error: string | null;
}
export declare const globalEmotes: (services?: Services) => Promise<ApiResponse<EmoteData[]>>;
export declare const channelEmotes: (channel: string, services?: Services) => Promise<ApiResponse<EmoteData[]>>;
export declare const channelIdentifier: (channel: string) => Promise<ApiResponse<ChannelIdentifier>>;
export declare const proxyChannelEmote: (channel: string, services?: Services) => Promise<ApiResponse<string | null>>;
