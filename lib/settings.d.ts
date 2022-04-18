export interface SettingsOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    cache?: boolean;
    cacheDir?: string;
    logApiRate?: boolean;
}
export interface SettingsConst {
    autoRefresh: boolean;
    refreshInterval: number;
    cache: boolean;
    cacheDir: string;
    logApiRate: boolean;
}
export declare function setSettings(adjustSettings: SettingsOptions): void;
export declare function getSetting<T extends keyof SettingsConst>(setting: T): SettingsConst[T];
