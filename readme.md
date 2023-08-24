# node-twitch-emotes

`npm i ZomoXYZ/node-twitch-emotes`

## initialization

```ts
async function initCache(
    channels?: string[],
    settings?: Partial<Settings>
): void
```

this function **must be ran first** (and awaited) before `spliceMessage` or `splitMessage` will work.

| argument   | type                | default | description                    |
|------------|---------------------|---------|--------------------------------|
| `channels` | `string[]`          | `[]`    | array of channel names to load |
| `settings` | `Partial<Settings>` | `{}`    | optional settings              |

## usage

```ts
function spliceMessage<T>(
    message: string,
    channel: string,
    callback?: (emote: EmoteData) => string | T,
    withEmotes?: string,
    strictTwitchEmotes?
): (string | T)[]
```

`spliceMessage` returns an array with strings cut directly where the emotes are, including spaces between emotes and grouping words together.

example: `["emote:EZ", " ", "emote:clap", " too good"]`

```ts
function splitMessage<T>(
    message: string,
    channel: string,
    callback?: (emote: EmoteData) => string | T,
    withEmotes?: string,
    strictTwitchEmotes?
): (string | T)[]
```

`splitMessage` returns an array of words with some words replaced with emote data.

example: `["emote:EZ", "emote:clap", "too", "good"]`

| argument             | type                         | default                    | description                               |
|----------------------|------------------------------|----------------------------|-------------------------------------------|
| `message`            | `string`                     |                            | chat message                              |
| `channel`            | `string`                     |                            | channel name                              |
| `callback`           | `(EmoteData) => string \| T` | highest quality url string | convert the emote data into something     |
| `withEmotes`         | `string`                     | `""`                       | native twitch emotes given via an IRC tag |
| `strictTwitchEmotes` | `boolean`                    | `false`                    | if `true`, native twitch emotes will only be applied through `withEmotes`; otherwise when `false`, all twitch and channel emotes will be checked for in the message (i.e. non-subs appear to have sub emotes) |

## types

settings

| key                 | type      | default              | description                                                  |
|---------------------|-----------|----------------------|--------------------------------------------------------------|
| `autoRefresh`       | `boolean` | `true`               | if `true`, run indefinitely and regularly check for new data |
| `refreshInterval`   | `number`  | `300000` (5 minutes) | time in milliseconds                                         |
| `cache`             | `boolean` | `true`               | caching on the disk                                          |
| `cacheDir`          | `string`  | `./cache`            | directory for cache                                          |
| `logApiRate`        | `boolean` | `true`               | log data about api rate limits                               |
| `maxRetryRateLimit` | `number`  | `1`                  | maximum retry attempts when rate limited (the request retries again after the rate limit time so `1` should suffice) |

```ts

export interface EmoteData {
    provider: Provider
    code: string
    urls: EmoteURL[]
}

export interface EmoteURL {
    size: '1x' | '2x' | '3x' | '4x'
    url: string
}

export enum Provider {
    'Twitch' = 0,
    '7TV' = 1,
    'BetterTTV' = 2,
    'FrankerFaceZ' = 3,
}
```

## example

(see the examples folder for ready and functional examples)

simple

```ts
import { initCache, spliceMessage } from 'twitch-emotes'

await initCache(['xqc'])

let message = spliceMessage('EZ Clap too good', 'xqc')
console.log(message)

/* 
 * [
 *  'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x',
 *  ' ',
 *  'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x',
 *  ' too good'
 * ]
 */

let messageWords = splitMessage('EZ Clap too good', 'xqc')
console.log(messageWords)

/* 
 * [
 *  'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x',
 *  'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x',
 *  'too'.
 *  'good'
 * ]
 */
```

advanced

```ts
import { initCache, spliceMessage } from 'twitch-emotes'

await initCache(['xqc'])

let message = spliceMessage('EZ Clap too good', 'xqc', emote => {
    return `emote:${emote.code}`
})
console.log(message)

// [ 'emote:EZ', ' ', 'emote:Clap', ' too good' ]

let messageWords = splitMessage('EZ Clap too good', 'xqc', emote => {
    return `emote:${emote.code}`
})
console.log(messageWords)

// [ 'emote:EZ', 'emote:Clap', 'too', 'good' ]
```
