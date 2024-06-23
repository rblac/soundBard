const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection, createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice')
const { testSound } = require('../../config.json')


module.exports = {
	data:
		new SlashCommandBuilder()
			.setName("test")
			.setDescription("Test sound."),
	async execute(interaction) {
		await interaction.reply('lmao??')
		const channel = interaction.member.voice.channel;
		const conn = getVoiceConnection(channel.guild.id);

		const ap = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
		const ar = createAudioResource(testSound)
		ap.play(ar);
		conn.subscribe(ap);

		// ap and ar both go out of scope here, so if after the playback is done the reference is automatically removed it *shouldn't* leak?
	}
}
