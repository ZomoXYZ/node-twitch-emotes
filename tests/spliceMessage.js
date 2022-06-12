import { initCache, spliceMessage, reloadChannel } from '../lib/index.js'
import { runTest } from './util/run.js'
import { compareArray, expectThrow } from './util/expect.js'

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
        'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x',
        'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x',
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

function testCacheError() {
    expectThrow(() => spliceMessage('EZ Clap too good', 'xqcow'), 'Channel xqcow not cached')
}

function testUsernameInvalid() {
    expectThrow(() => spliceMessage('EZ Clap too good', 'x'), 'Invalid channel name: x')
}

async function testUsernameError() {
    await expectThrow(
        () => reloadChannel('ajsybvjpulmatzyywhuzrlbyx'),
        `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    )
}

async function testUsernameError2() {
    await expectThrow(
        () => initCache(['ajsybvjpulmatzyywhuzrlbyx']),
        `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    )
}
