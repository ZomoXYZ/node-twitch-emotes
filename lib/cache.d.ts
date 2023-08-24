import { ChannelIdentifier, EmoteData } from './types';
import { Settings } from './settings';
export declare function initCache(channels?: string[], settings?: Partial<Settings>): Promise<void>;
export declare function reloadGlobalEmotes(): Promise<void>;
export declare function reloadChannel(channel: string): Promise<void>;
export declare function getChannel(channel: string): {
    identifier: ChannelIdentifier;
    emotes: EmoteData[];
};
export declare function getEmote(emote: string, channel?: string, noTwitch?: boolean): EmoteData | null;
