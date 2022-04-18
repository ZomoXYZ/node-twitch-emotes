export const indent = (prefix, json) =>
    JSON.stringify(json, null, 2)
        .split('\n')
        .map((line, i) => `${i === 0 ? prefix : ' '.repeat(prefix.length)}${line}`)
        .join('\n')

export function compareArray(given, expected) {
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

export async function runTest(test, name) {
    try {
        await test()
    } catch (e) {
        console.error(`
${name} test failed
${e.stack}
`)
    }
}