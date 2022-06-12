import { relative } from 'path'
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

const fixStack = err => {
    let reachedTests = false
    return err.stack
        .split('\n')
        .filter(line => {
            if (reachedTests) {
                return false
            }

            let foundPath = /file:\/\/\/(.*?):\d+:\d+/.exec(line)
            if (!foundPath) {
                return true
            }

            let relPath = relative(__dirname, foundPath[1])
            if (relPath.startsWith('..')) {
                return true
            }

            reachedTests = true
            return false
        })
        .join('\n')
}

export const message = (err, noLocalStack) => {
    let message = ''
    if (typeof err === 'string') {
        message = err
    } else if (err.constructor === ExpectError) {
        message = err.message
    } else if (noLocalStack) {
        message = fixStack(err)
    } else {
        message = err.stack
    }
    return indentLen(4, message)
}
