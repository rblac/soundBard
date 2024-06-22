'use script';

const { REST, Routes } = require('discord.js')
const { token, clientId } = require('../config.json')
const loadCommands = require('./commands.js').loadCommands

const commands = [];
loadCommands().forEach(command => { commands.push(command.data.toJSON()) });
console.log(commands)

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
