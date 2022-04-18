"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetting = exports.setSettings = void 0;
const Settings = {
    autoRefresh: true,
    refreshInterval: 1000 * 60 * 60 * 24,
    cache: true,
    cacheDir: './cache',
    logApiRate: true,
};
function setSettings(adjustSettings) {
    if (adjustSettings.autoRefresh !== undefined)
        Settings.autoRefresh = adjustSettings.autoRefresh;
    if (adjustSettings.refreshInterval !== undefined)
        Settings.refreshInterval = adjustSettings.refreshInterval;
    if (adjustSettings.cache !== undefined)
        Settings.cache = adjustSettings.cache;
    if (adjustSettings.cacheDir !== undefined)
        Settings.cacheDir = adjustSettings.cacheDir;
    if (adjustSettings.logApiRate !== undefined)
        Settings.logApiRate = adjustSettings.logApiRate;
}
exports.setSettings = setSettings;
function getSetting(setting) {
    return Settings[setting];
}
exports.getSetting = getSetting;
//# sourceMappingURL=settings.js.map