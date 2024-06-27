const http = require('node:http')
const express = require('express')
const path = require('node:path')
const multer = require('multer');
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

app.get('/web', (req, res) => {
	res.sendFile(
		path.join(fep, req.path),
		(err) => console.log(`Couldn't send file: ${err}`));
});

io.on('connection', (socket) => {
	console.log(`new client: ${socket.id}`);
	socket.on('disconnect', () => console.log('client disconnected'));

	socket.on('test', () => {
		fetch(new Request(botUrl, {
			method: 'POST',
			body: JSON.stringify(createPlayCommand(`${selfUrl}:${port}/sounds/test2.mp3`))
		}))
			.catch((reason) => console.error(`Failed to send test request: ${reason}`))
		console.log(`sending req to ${botUrl}`)
	});

	socket.on('upload', (name, file) => {
		console.log(`received ${name}`)
		const path = files.writeSound(name, file);
		files.registerSound(new files.SoundInfo(path, 'the uploaderrrr'));
	});
	socket.on('play', (soundId) => {
		// TODO
	});

	socket.on('list', (_user) => socket.emit(files.listSounds()));
})

function createPlayCommand(soundUrl) {
	return {
		type: 'play',
		soundUrl: soundUrl
	}
}

const rootPath = path.join(__dirname, filesRoot);
const upload = multer({ dest: rootPath })

app.use('/sounds', (req, res) => {
	res.sendFile(
		path.join(rootPath, req.path),
		(err) => console.log(`Couldn't send file: ${err}`));
});

server.listen(port, () => {
	files.init();
	files.registerSound(new files.SoundInfo("test.mp3", "dod"))
	files.registerSound(new files.SoundInfo("test2.mp3", "malice"))
	console.log(`Server listening on ${port}`)
})
