export interface Settings {
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

export function setSettings(adjustSettings: Partial<Settings>) {
    Settings = Object.assign(Settings, adjustSettings) as Settings
}

export function getSetting<T extends keyof Settings>(setting: T): Settings[T] {
    return Settings[setting]
}
