const { initCache, spliceMessage } = require('.')
// import { initCache, spliceMessage } from './src'

;(async () => {
	
	await initCache(['xqcow'])

	let message = spliceMessage('EZ Clap too good', 'xqcow')
	console.log(message)

})()
