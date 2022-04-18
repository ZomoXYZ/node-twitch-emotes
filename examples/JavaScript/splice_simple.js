import { highestQuality, spliceMessage } from '../../lib'

const message = spliceMessage('EZ Clap too good', 'xqcow', emote => ({
    name: emote.code,
    url: highestQuality(emote),
}))

message.forEach(word => {
    if (typeof word === 'string') {
        // is word
    } else {
        // is emote
    }
})
