import { __dirname } from '../index.js'

export const indentData = (prefix, json) =>
    JSON.stringify(json, null, 2)
        .split('\n')
        .map((line, i) => `${i === 0 ? prefix : ' '.repeat(prefix.length)}${line}`)
        .join('\n')

export const indent = (prefix, str) =>
    str
        .split('\n')
        .map((line, i) => `${i === 0 ? prefix : ' '.repeat(prefix.length)}${line}`)
        .join('\n')

export const indentLen = (len, str) =>
    str
        .split('\n')
        .map((line, i) => `${' '.repeat(len)}${line}`)
        .join('\n')

export class ExpectError extends Error {}

const fixStack = stack =>
    stack
        .split('\n')
        .filter(line => true)
        .join('\n')

export const message = err =>
    indentLen(4, err.constructor === ExpectError ? err.message : err.stack)
