import { runTestBatch } from './util/run.js'
import spliceMessage from './spliceMessage.js'
import splitMessage from './splitMessage.js'
import { install } from 'source-map-support'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

install({ environment: 'node' })

export const __dirname = dirname(fileURLToPath(import.meta.url))

await runTestBatch(spliceMessage, 'Splice Message')
await runTestBatch(splitMessage, 'Split Message Words')
console.log('All tests passed')
