const { highestQuality, initCache, spliceMessage } = require('.');

(async () => {
	try {
		await initCache(['xqcow'])

		spliceMessage('OMEGALUL Clap', 'xqcow', emote => {
			console.log(emote)
			return highestQuality(emote)
		})
	} catch(e) {
		console.error(e)
	}
})()