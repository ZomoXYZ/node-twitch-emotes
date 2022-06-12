export interface SettingsOptions {
    /** default: true */
    autoRefresh?: boolean
    /** default: 5 minutes */
    refreshInterval?: number
    /** caching on the disk
     *
     * default: true
     */
    cache?: boolean
    /** default: true */
    cacheDir?: string
    /** default: true */
    logApiRate?: boolean
    /** default: 1 */
    maxRetryRateLimit?: number
}
export interface Settings extends SettingsOptions {
    autoRefresh: boolean
    refreshInterval: number
    cache: boolean
    cacheDir: string
    logApiRate: boolean
    maxRetryRateLimit: number
}

var Settings: Settings = {
    autoRefresh: true,
    refreshInterval: 1000 * 60 * 5, // 5 minutes
    cache: true,
    cacheDir: './cache',
    logApiRate: true,
    maxRetryRateLimit: 1,
}

export function setSettings(adjustSettings: SettingsOptions) {
    Settings = Object.assign(Settings, adjustSettings) as Settings
}

export function getSetting<T extends keyof Settings>(setting: T): Settings[T] {
    return Settings[setting]
}
