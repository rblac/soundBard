const { createAudioResource, getVoiceConnection } = require('@discordjs/voice')
const { testSound } = require('../config.json')
const SM = require('./sound-manager.js')

module.exports = {
	handleRequest: function(r, client) {
		switch(r.type) {
			case "play":
				SM.play(createAudioResource(r.soundUrl))
				break;
			default:
				console.err(`Unrecognised server command type: ${r.type}`)
				break;
		}
	}
}
