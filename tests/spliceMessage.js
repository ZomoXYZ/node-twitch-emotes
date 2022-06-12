import { initCache, spliceMessage } from '../lib/index.js'
import { compareArray } from './util/index.js'

export default async function () {
    //set autoRefresh to false so the script ends naturally
    await initCache(['xqc'], { autoRefresh: false, cache: false, logApiRate: false })

    const withLinks = spliceMessage('EZ Clap too good', 'xqc')
    const withLinksExpected = [
        'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x',
        'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x',
        'too',
        'good',
    ]
    compareArray(withLinks, withLinksExpected)

    const asStrings = spliceMessage('EZ Clap too good', 'xqc', emote => `emote:${emote.code}`)
    const asStringsExpected = ['emote:EZ', 'emote:Clap', 'too', 'good']
    compareArray(asStrings, asStringsExpected)
}
