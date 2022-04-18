import { EmoteData } from './types';
export { ApiResponseTypes, ApiResponse } from './api';
export * from './cache';
export * from './types';
export * from './util';
export declare function spliceMessage<T>(message: string, channel: string, callback?: (emote: EmoteData) => string | T): (string | T)[];
