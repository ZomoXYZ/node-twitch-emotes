import { highestQuality, spliceMessage } from '../../lib'

interface EmoteImage {
    name: string
    url: string
}

const message = spliceMessage(
    'EZ Clap too good',
    'xqcow',
    (emote): EmoteImage => ({
        name: emote.code,
        url: highestQuality(emote),
    })
)

message.forEach(word => {
    if (typeof word === 'string') {
        // is word
    } else {
        // is emote
    }
})
