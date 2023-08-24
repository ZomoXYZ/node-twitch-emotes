import { highestQuality, initCache, splitMessage } from 'twitch-emotes'
await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})
const message = splitMessage('EZ Clap too good', 'xqc', emote => ({
    name: emote.code,
    url: highestQuality(emote),
}))
message.forEach(word => {
    if (typeof word === 'string') {
        // word
    } else {
        // emote
    }
})
