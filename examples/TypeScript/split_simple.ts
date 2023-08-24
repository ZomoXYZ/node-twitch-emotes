import { highestQuality, initCache, splitMessage } from 'twitch-emotes'

await initCache(['xqc'], {
    autoRefresh: false,
    cache: false,
    logApiRate: false,
})

interface EmoteImage {
    name: string
    url: string
}

const message = splitMessage(
    'EZ Clap too good',
    'xqc',
    (emote): EmoteImage => ({
        name: emote.code,
        url: highestQuality(emote),
    })
)

message.forEach(word => {
    if (typeof word === 'string') {
        // word
    } else {
        // emote
    }
})
