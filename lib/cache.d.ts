import { ChannelIdentifier, EmoteData } from './types';
import { SettingsOptions } from './settings';
export declare function initCache(channels?: string[], settings?: SettingsOptions): Promise<void>;
export declare function reloadGlobalEmotes(): Promise<void>;
export declare function reloadChannel(channel: string): Promise<void>;
export declare function getChannel(channel: string): {
    identifier: ChannelIdentifier;
    emotes: EmoteData[];
};
export declare function getEmote(emote: string, channel?: string): EmoteData | false | null;
