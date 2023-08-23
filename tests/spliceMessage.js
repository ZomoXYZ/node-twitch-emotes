import { initCache, spliceMessage, reloadChannel } from '../lib/index.js'
import { runTest } from './util/run.js'
import { compareArray, expectThrow } from './util/expect.js'
import { message } from './util/util.js'

export default async function () {
    //set autoRefresh to false so the script ends naturally
    await initCache(['xqc'], { autoRefresh: false, cache: false, logApiRate: false })

    await runTest(testAsURL, 'As Url')
    await runTest(testAsString, 'As String')
    await runTest(testCacheError, 'Cache Error')
    await runTest(testUsernameInvalid, 'Username Invalid')
    await runTest(testUsernameError, 'Username Error')
    await runTest(testUsernameError2, 'Username Error 2')
}

function testAsURL() {
    const message = spliceMessage('EZ Clap too good', 'xqc')
    const expected = [
        'https://cdn.7tv.app/emote/63071b80942ffb69e13d700f/4x.webp',
        'https://cdn.7tv.app/emote/62fc0a0c4a75fd54bd3520a9/4x.webp',
        'too',
        'good',
    ]
    compareArray(message, expected)
}

function testAsString() {
    const message = spliceMessage('EZ Clap too good', 'xqc', emote => `emote:${emote.code}`)
    const expected = ['emote:EZ', 'emote:Clap', 'too', 'good']
    compareArray(message, expected)
}

async function testCacheError() {
    const func = () => spliceMessage('EZ Clap too good', 'xqcow')
    const expected = 'Channel xqcow not cached'
    await expectThrow(func, expected)
}

async function testUsernameInvalid() {
    const func = () => spliceMessage('EZ Clap too good', 'x')
    const expected = 'Invalid channel name: x'
    await expectThrow(func, expected)
}

async function testUsernameError() {
    const func = () => reloadChannel('ajsybvjpulmatzyywhuzrlbyx')
    const expected = `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    await expectThrow(func, expected)
}

async function testUsernameError2() {
    const func = () => initCache(['ajsybvjpulmatzyywhuzrlbyx'])
    const expected = `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    await expectThrow(func, expected)
}
