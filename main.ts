import { highestQuality, initCache, spliceMessage } from './ttvemotes'

initCache()

spliceMessage('OMEGALUL Clap', 'xqcow', emote => {
	console.log(emote)
	return highestQuality(emote)
})
