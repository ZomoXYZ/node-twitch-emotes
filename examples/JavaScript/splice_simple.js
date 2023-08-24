import { highestQuality, initCache, spliceMessage } from 'twitch-emotes'
await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})
const message = spliceMessage('EZ Clap too good', 'xqc', emote => ({
    name: emote.code,
    url: highestQuality(emote),
}))
message.forEach(part => {
    if (typeof part === 'string') {
        // string
    } else {
        // emote
    }
})
