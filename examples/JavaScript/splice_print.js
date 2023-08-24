import { initCache, spliceMessage } from 'twitch-emotes'
await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})
const message = spliceMessage('EZ Clap too good', 'xqc', emote => `{${emote.code}}`)
console.log(message.join(''))
