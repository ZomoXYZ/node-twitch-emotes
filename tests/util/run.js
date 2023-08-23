import { message } from './util.js'

export async function runTestBatch(test, name) {
    console.log(`Batch "${name}" starting`)
    try {
        await test()
        console.log(`Batch "${name}" passed`)
    } catch (e) {
        console.error(`Batch "${name}" failed
${message(e)}`)
        process.exit(1)
    }
}

export async function runTest(test, name) {
    try {
        await test()
        console.log(`Test "${name}" passed`)
    } catch (e) {
        throw `Test "${name}" failed
${message(e)}`
    }
}
