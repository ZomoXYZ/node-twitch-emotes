import { runTestBatch } from './util/run.js'
import spliceMessage from './spliceMessage.js'
import { install } from 'source-map-support'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

install({ environment: 'node' })

export const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname)

Promise.all([runTestBatch(spliceMessage, 'spliceMessage')]).then(() =>
    console.log('All tests passed')
)
