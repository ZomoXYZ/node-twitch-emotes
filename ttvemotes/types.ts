export interface ChannelIdentifier {
    id: number;
    login: string;
    display_name: string;
    /** uri */
    avatar: string;
}

export enum Provider {
    'Twitch' = 0,
    '7TV',
    'BetterTTV',
    'FrankerFaceZ'
}

export interface EmoteURL {
    size: '1x'|'2x'|'3x'|'4x';
    url: string
}

export interface EmoteData {
    provider: Provider;
    code: string;
    urls: EmoteURL[];
}