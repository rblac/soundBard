const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { env } = require('node:process')

const token = env.BOT_TOKEN;
const clientId = env.BOT_CLIENTID

module.exports = {
	loadCommands: function() {
		const commands = [];

		const commandsPath = path.join(__dirname, 'commands')
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command)
				commands.push(command);
			else console.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}

		return commands;
	},
	deployCommands: function() {
		const commands = [];
		this.loadCommands().forEach(command => { commands.push(command.data.toJSON()) });

		const rest = new REST().setToken(token);

		(async () => {
			try {
				console.log(`Refreshing ${commands.length} application commands.`)

				const data = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands }
				);

				console.log(`Succesfully refreshed ${data.length} commands.`)
			} catch(e) {
				console.error(`Error while refreshing commands: ${e}`)
			}
		})()
	}
};
