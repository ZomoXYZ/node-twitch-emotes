export interface SettingsOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    cache?: boolean;
    cacheDir?: string;
    logApiRate?: boolean;
    maxRetryRateLimit?: number;
}
export interface Settings extends SettingsOptions {
    autoRefresh: boolean;
    refreshInterval: number;
    cache: boolean;
    cacheDir: string;
    logApiRate: boolean;
    maxRetryRateLimit: number;
}
export declare function setSettings(adjustSettings: SettingsOptions): void;
export declare function getSetting<T extends keyof Settings>(setting: T): Settings[T];
