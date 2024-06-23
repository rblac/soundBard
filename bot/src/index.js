'use strict';

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('../config.json');

const fs = require('node:fs');
const path = require('node:path');

const loadCommands = require('./commands.js').loadCommands

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Init commands
	client.commands = new Collection();
	loadCommands().forEach(command => {
		console.log(`registered command ${command.data.name}`)
		client.commands.set(command.data.name, command);
	})

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isChatInputCommand()) return;

		const comm = interaction.client.commands.get(interaction.commandName);
		if(!comm) {
			console.error(`Invalid command name: ${interaction.commandName}`);
			return;
		}
		
		try { await comm.execute(interaction); }
		catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred)
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			else await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	});


// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);
