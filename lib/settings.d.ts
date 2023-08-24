export interface Settings {
    autoRefresh: boolean;
    refreshInterval: number;
    cache: boolean;
    cacheDir: string;
    logApiRate: boolean;
    maxRetryRateLimit: number;
}
export declare function setSettings(adjustSettings: Partial<Settings>): void;
export declare function getSetting<T extends keyof Settings>(setting: T): Settings[T];
