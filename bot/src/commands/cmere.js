const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("cmere")
			.setDescription("Call the bot over to the user's current voice channel."),
	async execute(interaction) {
		await interaction.reply('on it boss')
	}
}
