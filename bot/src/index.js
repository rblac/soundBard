const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { listenPort } = require('../config.json');
const { env } = require('node:process')

const token = env.BOT_TOKEN;

const http = require('node:http')

const commands = require('./commands.js')
const { handleRequest } = require('./request-handler.js')

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

// Init commands
client.commands = new Collection();
commands.loadCommands().forEach(command => {
	console.log(`registered command ${command.data.name}`)
	client.commands.set(command.data.name, command);
})
commands.deployCommands();

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

	// Start listening for server messages
	const botServ = http.createServer((req, res) => {
		var body = "";
		req.on('data', chunk => {
			body += chunk;
		}).on('end', () => {
			req = JSON.parse(body);
			handleRequest(req, client);
		})
		res.end()
	});
	botServ.listen(listenPort);
	console.log(`Listening on port ${listenPort}`);
});

// Log in to Discord with your client's token
client.login(token);
