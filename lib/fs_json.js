"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson = exports.readJson = void 0;
const promises_1 = require("fs/promises");
async function readJson(path) {
    const data = await (0, promises_1.readFile)(path, 'utf8');
    return JSON.parse(data);
}
exports.readJson = readJson;
async function writeJson(path, data) {
    const json = JSON.stringify(data);
    await (0, promises_1.writeFile)(path, json, 'utf8');
}
exports.writeJson = writeJson;
//# sourceMappingURL=fs_json.js.map