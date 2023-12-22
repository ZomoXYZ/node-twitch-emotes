import { initCache, spliceMessage, reloadChannel } from '../lib/index.js'
import { runTest } from './util/run.js'
import { compareArray, expectThrow } from './util/expect.js'
import { REGEX_TWITCH, REGEX_7TV } from './util/util.js'

export default async function () {
    //set autoRefresh to false so the script ends naturally
    await initCache(['xqc'], { autoRefresh: false, cache: false, logApiRate: false })

    await runTest(test2AsURL, 'As Url')

    await runTest(test2AsURLStrict, 'As Url Strict')
    await runTest(test2AsURLNotStrict, 'As Url Not Strict')
    await runTest(test2AsURLStrictDefault, 'As Url Default Strictness')

    await runTest(test2AsURLWithEmotes, 'As Url With Emotes')
    await runTest(test2AsURLWithEmotesCombined, 'As Url With Emotes Combined')

    await runTest(test2AsString, 'As String')
    await runTest(test2AsStringWithEmotes, 'As String With Emotes')
    await runTest(test2AsStringWithEmotesCombined, 'As String With Emotes Combined')

    await runTest(test2CacheError, 'Cache Error')
    await runTest(test2UsernameInvalid, 'Username Invalid')
    await runTest(test2UsernameError, 'Username Error')
    await runTest(test2UsernameError2, 'Username Error 2')
}

function test2AsURL() {
    const message = spliceMessage('EZ Clap too good', 'xqc')
    const expected = [
        REGEX_7TV,
        ' ',
        REGEX_7TV,
        ' too good',
    ]
    compareArray(message, expected)
}

function test2AsURLStrict() {
    const message = spliceMessage('xqcL', 'xqc', undefined, undefined, true)
    const expected = ['xqcL']
    compareArray(message, expected)
}

function test2AsURLNotStrict() {
    const message = spliceMessage('xqcL', 'xqc', undefined, undefined, false)
    const expected = [REGEX_TWITCH]
    compareArray(message, expected)
}

function test2AsURLStrictDefault() {
    const message = spliceMessage('xqcL', 'xqc')
    const expected = [REGEX_TWITCH]
    compareArray(message, expected)
}

function test2AsURLWithEmotes() {
    const message = spliceMessage(
        'hasHi hasSlam hasPOGGERS hasPOGGIES',
        'xqc',
        undefined,
        'emotesv2_8b228c4bd87b4305a4c05179353e751a:0-4/emotesv2_4f058d58458544a4971de55672468204:6-12/302587322:14-23/303446318:25-34',
        true
    )
    const expected = [
        REGEX_TWITCH,
        ' ',
        REGEX_TWITCH,
        ' ',
        REGEX_TWITCH,
        ' ',
        REGEX_TWITCH,
    ]
    compareArray(message, expected)
}

function test2AsURLWithEmotesCombined() {
    const message = spliceMessage(
        'EZ Clap hasPOGGERS hasPOGGIES too good',
        'xqc',
        undefined,
        '302587322:8-17/303446318:19-28'
    )
    const expected = [
        REGEX_7TV,
        ' ',
        REGEX_7TV,
        ' ',
        REGEX_TWITCH,
        ' ',
        REGEX_TWITCH,
        ' too good',
    ]
    compareArray(message, expected)
}

function test2AsString() {
    const message = spliceMessage('EZ Clap too good', 'xqc', emote => `emote:${emote.code}`)
    const expected = ['emote:EZ', ' ', 'emote:Clap', ' too good']
    compareArray(message, expected)
}

function test2AsStringWithEmotes() {
    const message = spliceMessage(
        'hasHi hasSlam hasPOGGERS hasPOGGIES',
        'xqc',
        emote => `emote:${emote.code}`,
        'emotesv2_8b228c4bd87b4305a4c05179353e751a:0-4/emotesv2_4f058d58458544a4971de55672468204:6-12/302587322:14-23/303446318:25-34'
    )
    const expected = [
        'emote:hasHi',
        ' ',
        'emote:hasSlam',
        ' ',
        'emote:hasPOGGERS',
        ' ',
        'emote:hasPOGGIES',
    ]
    compareArray(message, expected)
}

function test2AsStringWithEmotesCombined() {
    const message = spliceMessage(
        'EZ Clap hasPOGGERS hasPOGGIES too good',
        'xqc',
        emote => `emote:${emote.code}`,
        '302587322:8-17/303446318:19-28'
    )
    const expected = [
        'emote:EZ',
        ' ',
        'emote:Clap',
        ' ',
        'emote:hasPOGGERS',
        ' ',
        'emote:hasPOGGIES',
        ' too good',
    ]
    compareArray(message, expected)
}

async function test2CacheError() {
    const func = () => spliceMessage('EZ Clap too good', 'xqcow')
    const expected = 'Channel xqcow not cached'
    await expectThrow(func, expected)
}

async function test2UsernameInvalid() {
    const func = () => spliceMessage('EZ Clap too good', 'x')
    const expected = 'Invalid channel name: x'
    await expectThrow(func, expected)
}

async function test2UsernameError() {
    const func = () => reloadChannel('ajsybvjpulmatzyywhuzrlbyx')
    const expected = `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    await expectThrow(func, expected)
}

async function test2UsernameError2() {
    const func = () => initCache(['ajsybvjpulmatzyywhuzrlbyx'])
    const expected = `Error fetching channel data for ajsybvjpulmatzyywhuzrlbyx
Emote Error: User not found
Identifier Error: User not found`
    await expectThrow(func, expected)
}
