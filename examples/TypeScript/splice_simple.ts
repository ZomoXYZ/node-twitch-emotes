import { highestQuality, initCache, spliceMessage } from 'twitch-emotes'

await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})

interface EmoteImage {
    name: string
    url: string
}

const message = spliceMessage(
    'EZ Clap too good',
    'xqc',
    (emote): EmoteImage => ({
        name: emote.code,
        url: highestQuality(emote),
    })
)

message.forEach(part => {
    if (typeof part === 'string') {
        // string
    } else {
        // emote
    }
})
