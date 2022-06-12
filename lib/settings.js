"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetting = exports.setSettings = void 0;
var Settings = {
    autoRefresh: true,
    refreshInterval: 1000 * 60 * 5,
    cache: true,
    cacheDir: './cache',
    logApiRate: true,
    maxRetryRateLimit: 1,
};
function setSettings(adjustSettings) {
    Settings = Object.assign(Settings, adjustSettings);
}
exports.setSettings = setSettings;
function getSetting(setting) {
    return Settings[setting];
}
exports.getSetting = getSetting;
//# sourceMappingURL=settings.js.map