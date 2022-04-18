export interface SettingsOptions {
    /** default: true */
    autoRefresh?: boolean
    /** default: 1 day */
    refreshInterval?: number
    /**  */
    /**
     * caching on the disk
     *
     * default: true
     */
    cache?: boolean
    /** default: true */
    cacheDir?: string
    /** default: true */
    logApiRate?: boolean
}
export interface SettingsConst {
    autoRefresh: boolean
    refreshInterval: number
    cache: boolean
    cacheDir: string
    logApiRate: boolean
}

const Settings: SettingsConst = {
    autoRefresh: true,
    refreshInterval: 1000 * 60 * 60 * 24, // 1 day
    cache: true,
    cacheDir: './cache',
    logApiRate: true,
}

export function setSettings(adjustSettings: SettingsOptions) {
    if (adjustSettings.autoRefresh !== undefined) Settings.autoRefresh = adjustSettings.autoRefresh
    if (adjustSettings.refreshInterval !== undefined)
        Settings.refreshInterval = adjustSettings.refreshInterval
    if (adjustSettings.cache !== undefined) Settings.cache = adjustSettings.cache
    if (adjustSettings.cacheDir !== undefined) Settings.cacheDir = adjustSettings.cacheDir
    if (adjustSettings.logApiRate !== undefined) Settings.logApiRate = adjustSettings.logApiRate
}

export function getSetting<T extends keyof SettingsConst>(setting: T): SettingsConst[T] {
    return Settings[setting]
}
