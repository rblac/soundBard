const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
const SM = require('../sound-manager.js')

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("cmere")
			.setDescription("Call the bot over to the user's current voice channel."),
	async execute(interaction) {
		await interaction.reply('on it boss');
		const channel = interaction.member.voice.channel;
		SM.connect(channel);
	}
}
