const { SlashCommandBuilder, SlashCommandUserOption } = require("discord.js");
const { getVoiceConnection, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice')
const SM = require('../sound-manager.js')

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("play")
			.setDescription("Play sound from given link")
			.addStringOption(opt => opt
				.setName("link")
				.setDescription("the source link")
				.setRequired(true)
			),
	async execute(interaction) {
		// classic injection vuln waiting to happen :)
		const ar = createAudioResource(link)
		SM.play(ar);
		await interaction.reply(`playing ${link}`);
	}
}
