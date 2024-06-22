const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("bye")
			.setDescription("Make the bot exit the channel."),
	async execute(interaction) {
		await interaction.reply('baii ^-^')
	}
}
