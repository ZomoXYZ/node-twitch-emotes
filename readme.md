# node-twitch-emotes

`npm i ZomoXYZ/node-twitch-emotes`

## example

(see `test.js` for a ready and functional example)

simple

```ts
import { initCache, spliceMessage } from 'twitch-emotes'

await initCache(['xqc'])

let message = spliceMessage('EZ Clap too good', 'xqc')
console.log(message)

// [ 'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x', 'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x', 'too', 'good' ]
```

advanced

```ts
import { initCache, spliceMessage } from 'twitch-emotes'

await initCache(['xqc'])

let message = spliceMessage('EZ Clap too good', 'xqc', emote => {
    return `emote:${emote.code}`
})
console.log(message)

// [ 'emote:EZ', 'emote:Clap', 'too', 'good' ]
```
