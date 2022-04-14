# node-twitch-emotes

`npm i ZomoXYZ/node-twitch-emotes`

## example

simple

```ts
import { initCache, spliceMessage } from 'node-twitch-emotes'
    
await initCache(['xqcow'])

let message = spliceMessage('EZ Clap too good', 'xqcow')
console.log(message)

// [ 'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x', 'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x', 'too', 'good' ]
```

advanced

```ts
import { initCache, spliceMessage } from 'node-twitch-emotes'
    
await initCache(['xqcow'])

let message = spliceMessage('EZ Clap too good', 'xqcow', emote => {
    return `emote:${emote.code}`
})
console.log(message)

// [ 'emote:EZ', 'emote:Clap', 'too', 'good' 
```
