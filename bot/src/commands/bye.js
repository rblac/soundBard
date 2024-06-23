const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("bye")
			.setDescription("Make the bot exit the channel."),
	async execute(interaction) {
		await interaction.reply('baii ^-^')
		const channel = interaction.member.voice.channel;
		const conn = getVoiceConnection(channel.guild.id)
		conn.destroy()
	}
}
