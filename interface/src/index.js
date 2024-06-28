const http = require('node:http')
const express = require('express')
const path = require('node:path')
const { Server } = require('socket.io')

const { port, botUrl, selfUrl, filesRoot, frontendRoot } = require('../config.json');
const files = require('./files.js')

const fep = path.join(__dirname, frontendRoot);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

app.use(function(_, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", (_, res) => {
	res.sendFile(path.join(fep,"index.html"))
});


function createPlayCommand(soundUrl) {
	return {
		type: 'play',
		soundUrl: soundUrl
	}
}

var clients = new Map();
io.on('connection', (socket) => {
	console.log(`new client: ${socket.id}`);
	var username = "guest"+socket.id;
	clients.set(socket.id, username);
	socket.emit('list-data', files.listSounds(username));

	socket.on('set-user', (newUsername) => {
		// username already in use
		if(Array.from(clients.values()).includes(newUsername) && newUsername != username) {
			console.err(`Username ${newUsername} already taken.`)
			socket.emit('user-taken', newUsername);
			return;
		}
		username = newUsername;
		clients.set(socket.id, username);
		socket.emit('ack-user', username)
		socket.emit('list-data', files.listSounds(username));
	});

	socket.on('list', () => socket.emit('list-data', files.listSounds(username)));

	socket.on('disconnect', () => {
		clients.delete(socket.id);
		console.log(`client disconnected: ${username}`);
	});

	socket.on('test', () => {
		fetch(new Request(botUrl, {
			method: 'POST',
			body: JSON.stringify(createPlayCommand(`${selfUrl}:${port}/sounds/test2.mp3`))
		}))
			.catch((reason) => console.error(`Failed to send test request: ${reason}`))
	});

	socket.on('upload', (name, file) => {
		console.log(`received ${name}`)
		try {
			const fileName = files.writeSound(name, file);
			const soundInfo = new files.SoundInfo(fileName, username);
			files.registerSound(soundInfo)
			io.emit('new-sound', soundInfo);
		} catch(e) {
			console.error(`failed to initialise new sound: ${e}`);
		}
	});
	socket.on('play', (id) => {
		const filename = files.getSoundFilename(id);
		fetch(new Request(botUrl, {
			method: 'POST',
			body: JSON.stringify(createPlayCommand(`${selfUrl}:${port}/sounds/${filename}`))
		}))
			.catch((reason) => console.error(`Failed to send test request: ${reason}`))
	});
	socket.on('delete', (id) => {
		if(files.eraseSound(username, id))
			io.emit('del-sound', id);
	})
	socket.on('set-vis', (id, isPublic) => {
		if(files.setSoundVis(username, id, isPublic)) {
			io.emit('vis', id, isPublic);
		}
	})
})

const rootPath = path.join(__dirname, filesRoot);

app.use('/sounds', (req, res) => {
	res.sendFile(
		path.join(rootPath, req.path),
		(err) => {
			if(err && err != 'Request aborted')
				console.log(`Couldn't send file: ${err}`)
		}
	);
});

server.listen(port, () => {
	files.init();
	console.log(`Server listening on ${port}`)
})
