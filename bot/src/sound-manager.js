const { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice')

var currentChannel = null

module.exports = {
	play: function(audioRes) {
		const conn = getVoiceConnection(currentChannel.guild.id);
		conn.dispatchAudio();
		const ap = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
		ap.play(audioRes);
		conn.subscribe(ap);
	},
	connect: function(channel) {
		joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator
		});
		currentChannel = channel;
	},
	disconnect: function() {
		if(!currentChannel) return false;

		const conn = getVoiceConnection(currentChannel.guild.id)
		conn.destroy()
		return true;
	}
}

