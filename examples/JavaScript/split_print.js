import { initCache, splitMessage } from 'twitch-emotes'
await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})
const message = splitMessage('EZ Clap too good', 'xqc', emote => `{${emote.code}}`)
console.log(message.join(' '))
