const { initCache, spliceMessage } = require('.')

;(async () => {
    try {
        await initCache(['xqcow'])

        let message = spliceMessage('OMEGALUL Clap perfect', 'xqcow')
        console.log('OMEGALUL Clap perfect', message)
    } catch (e) {
        console.error(e)
    }
})()
