const { initCache, spliceMessage } = require('.')

;(async () => {
	
	//set autoRefresh to false so the script ends naturally
	await initCache(['xqcow'], { autoRefresh: false })

	let messageWithLinks = spliceMessage('EZ Clap too good', 'xqcow')
	console.log(messageWithLinks)
	// [ 'https://cdn.betterttv.net/emote/5590b223b344e2c42a9e28e3/3x', 'https://cdn.betterttv.net/emote/55b6f480e66682f576dd94f5/3x', 'too', 'good' ]

	let messageAsStrings = spliceMessage('EZ Clap too good', 'xqcow', emote => `emote:${emote.code}`)
	console.log(messageAsStrings)
	// [ 'emote:EZ', 'emote:Clap', 'too', 'good' ]

})()
