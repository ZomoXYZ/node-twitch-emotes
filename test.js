const { initCache, spliceMessage } = require('.')

const indent = (prefix, json) =>
    JSON.stringify(json, null, 2)
        .split('\n')
        .map((line, i) => `${i === 0 ? prefix : ' '.repeat(prefix.length)}${line}`)
        .join('\n')

function compareArray(given, expected) {
    if (!Array.isArray(given)) {
        throw new Error(`Type Error: !Array.isArray(${given})
${indent('Expected: ', expected)}
${indent('Given: ', given)}`)
    }

    if (given.length !== expected.length) {
        throw new Error(`Length Error: ${given.length} !== ${expected.length}
${indent('Expected: ', expected)}
${indent('Given: ', given)}`)
    }

    expected.forEach((val, i) => {
        if (val !== given[i]) {
            throw new Error(`Value Error at index ${i}: ${val} !== ${given[i]}
${indent('Expected: ', expected)}
${indent('Given: ', given)}`)
        }
    })
}

;(async () => {
    //set autoRefresh to false so the script ends naturally
    await initCache(['xqcow'], { autoRefresh: false, cache: false, logApiRate: false })

    const withLinks = spliceMessage('EZ Clap too good', 'xqcow')
    const withLinksExpected = [
        'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x',
        'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x',
        'too',
        'good',
    ]
    compareArray(withLinks, withLinksExpected)

    const asStrings = spliceMessage('EZ Clap too good', 'xqcow', emote => `emote:${emote.code}`)
    const asStringsExpected = ['emote:EZ', 'emote:Clap', 'too', 'good']
    compareArray(asStrings, asStringsExpected)
})()
