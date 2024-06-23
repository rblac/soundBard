const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice')
const SM = require('../sound-manager.js')

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("bye")
			.setDescription("Make the bot exit the channel."),
	async execute(interaction) {
		if(SM.disconnect()) await interaction.reply('baii ^-^')
		else await interaction.reply(':face_with_raised_eyebrow: :face_with_raised_eyebrow: :face_with_raised_eyebrow:')
	}
}
