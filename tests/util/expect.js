import { indent, indentData, ExpectError, message } from './util.js'

export function compareArray(given, expected) {
    if (!Array.isArray(given)) {
        throw new ExpectError(`Type Error: !Array.isArray(${given})
${indentData('Expected: ', expected)}
${indentData('Given:    ', given)}`)
    }

    if (given.length !== expected.length) {
        throw new ExpectError(`Length Error: ${given.length} !== ${expected.length}
${indentData('Expected: ', expected)}
${indentData('Given:    ', given)}`)
    }

    expected.forEach((val, i) => {
        if (val !== given[i]) {
            throw new ExpectError(`Value Error at index ${i}: ${val} !== ${given[i]}
${indentData('Expected: ', expected)}
${indentData('Given:    ', given)}`)
        }
    })
}

export function expect(given, expected) {
    if (given !== expected) {
        throw new ExpectError(`${indentData('Expected: ', expected)}
${indentData('Given:    ', given)}`)
    }
}

export async function expectThrow(given, expected) {
    try {
        await given()
    } catch (e) {
        if (e.message !== expected) {
            throw new ExpectError(`${indent('Expected:    ', expected)}
${`Given ${message(e)}`}`)
        }
        return
    }
    throw new ExpectError(`${indent('Expected error: ', expected)}
Given error:    none`)
}
