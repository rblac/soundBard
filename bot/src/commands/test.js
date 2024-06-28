const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice')
const { testSound } = require('../../config.json')
const SM = require('../sound-manager.js')

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("test")
			.setDescription("Test sound."),
	async execute(interaction) {
		const ar = createAudioResource(testSound);
		SM.play(ar);
		await interaction.reply(':face_with_raised_eyebrow:');
	}
}
