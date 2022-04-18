export interface ChannelIdentifier {
    id: number;
    login: string;
    display_name: string;
    avatar: string;
}
export declare enum Provider {
    'Twitch' = 0,
    '7TV' = 1,
    'BetterTTV' = 2,
    'FrankerFaceZ' = 3
}
export interface EmoteURL {
    size: '1x' | '2x' | '3x' | '4x';
    url: string;
}
export interface EmoteData {
    provider: Provider;
    code: string;
    urls: EmoteURL[];
}
