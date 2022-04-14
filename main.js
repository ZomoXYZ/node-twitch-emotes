import { highestQuality, initCache, spliceMessage } from '.'

initCache(['xQcOw'])

spliceMessage('OMEGALUL Clap', 'xQcOw', emote => {
	console.log(emote)
	return highestQuality(emote)
})
