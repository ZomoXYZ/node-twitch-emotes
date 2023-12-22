import { initCache, splitMessage, reloadChannel } from '../lib/index.js'
import { runTest } from './util/run.js'
import { compareArray, expectThrow } from './util/expect.js'
import { REGEX_TWITCH, REGEX_7TV } from './util/util.js'

export default async function () {
    //set autoRefresh to false so the script ends naturally
    await initCache(['xqc'], { autoRefresh: false, cache: false, logApiRate: false })

    await runTest(testAsURL, 'As Url')

    await runTest(testAsURLStrict, 'As Url Strict')
    await runTest(testAsURLNotStrict, 'As Url Not Strict')
    await runTest(testAsURLStrictDefault, 'As Url Default Strictness')

    await runTest(testAsURLWithEmotes, 'As Url With Emotes')
    await runTest(testAsURLWithEmotesCombined, 'As Url With Emotes Combined')

    await runTest(testAsString, 'As String')
    await runTest(testAsStringWithEmotes, 'As String With Emotes')
    await runTest(testAsStringWithEmotesCombined, 'As String With Emotes Combined')

    await runTest(testCacheError, 'Cache Error')
    await runTest(testUsernameInvalid, 'Username Invalid')
    await runTest(testUsernameError, 'Username Error')
    await runTest(testUsernameError2, 'Username Error 2')
}

function testAsURL() {
    const message = splitMessage('EZ Clap too good', 'xqc')
    const expected = [
        REGEX_7TV,
        REGEX_7TV,
        'too',
        'good',
    ]
    compareArray(message, expected)
}

function testAsURLStrict() {
    const message = splitMessage('xqcL', 'xqc', undefined, undefined, true)
    const expected = ['xqcL']
    compareArray(message, expected)
}

function testAsURLNotStrict() {
    const message = splitMessage('xqcL', 'xqc', undefined, undefined, false)
    const expected = [REGEX_TWITCH]
    compareArray(message, expected)
}

function testAsURLStrictDefault() {
    const message = splitMessage('xqcL', 'xqc')
    const expected = [REGEX_TWITCH]
    compareArray(message, expected)
}

function testAsURLWithEmotes() {
    const message = splitMessage(
        'hasHi hasSlam hasPOGGERS hasPOGGIES',
        'xqc',
        undefined,
        'emotesv2_8b228c4bd87b4305a4c05179353e751a:0-4/emotesv2_4f058d58458544a4971de55672468204:6-12/302587322:14-23/303446318:25-34',
        true
    )
    const expected = [
        REGEX_TWITCH,
        REGEX_TWITCH,
        REGEX_TWITCH,
        REGEX_TWITCH,
    ]
    compareArray(message, expected)
}

function testAsURLWithEmotesCombined() {
    const message = splitMessage(
        'EZ Clap hasPOGGERS hasPOGGIES too good',
        'xqc',
        undefined,
        '302587322:8-17/303446318:19-28'
    )
    const expected = [
        REGEX_7TV,
        REGEX_7TV,
        REGEX_TWITCH,
        REGEX_TWITCH,
        'too',
        'good',
    ]
    compareArray(message, expected)
}

function testAsString() {
    const message = splitMessage('EZ Clap too good', 'xqc', emote => `emote:${emote.code}`)
    const expected = ['emote:EZ', 'emote:Clap', 'too', 'good']
    compareArray(message, expected)
}

function testAsStringWithEmotes() {
    const message = splitMessage(
        'hasHi hasSlam hasPOGGERS hasPOGGIES',
        'xqc',
        emote => `emote:${emote.code}`,
        'emotesv2_8b228c4bd87b4305a4c05179353e751a:0-4/emotesv2_4f058d58458544a4971de55672468204:6-12/302587322:14-23/303446318:25-34'
    )
    const expected = ['emote:hasHi', 'emote:hasSlam', 'emote:hasPOGGERS', 'emote:hasPOGGIES']
    compareArray(message, expected)
}

function testAsStringWithEmotesCombined() {
    const message = splitMessage(
        'EZ Clap hasPOGGERS hasPOGGIES too good',
        'xqc',
        emote => `emote:${emote.code}`,
        '302587322:8-17/303446318:19-28'
    )
    const expected = [
        'emote:EZ',
        'emote:Clap',
        'emote:hasPOGGERS',
        'emote:hasPOGGIES',
        'too',
        'good',
    ]
    compareArray(message, expected)
}

async function testCacheError() {
    const func = () => splitMessage('EZ Clap too good', 'xqcow')
    const expected = 'Channel xqcow not cached'
    await expectThrow(func, expected)
}

async function testUsernameInvalid() {
    const func = () => splitMessage('EZ Clap too good', 'x')
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
