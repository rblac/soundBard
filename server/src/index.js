const http = require('node:http')
const express = require('express')
const path = require('node:path')
const cors = require('cors');
const { port, botUrl, selfUrl, filesRoot } = require('../config.json');
const files = require('./files.js')

const app = express();

//app.use(cors({ origin: [ 'localhost' ] }))
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", (req, res) => {
	res.send("hola mundo")
	res.end();
});

function createPlayCommand(soundUrl) {
	return {
		type: 'play',
		soundUrl: soundUrl
	}
}
app.get("/test", (req, res) => {
	fetch(new Request(botUrl, {
		method: 'POST',
		body: JSON.stringify(createPlayCommand(`${selfUrl}:${port}/sounds/test2.mp3`))
	}))
		.catch((reason) => console.error(`Failed to send test request: ${reason}`))
	console.log(`sending req to ${botUrl}`)
	res.status(200);
	res.end();
});

app.get("/list", (req, res) => {
	//const name = req.body.userName;
	res.status(200);
	res.send(files.listSounds());
	res.end();
});

//app.use('/sounds/', express.static(path.join(__dirname, filesRoot)));
const rootPath = path.join(__dirname, filesRoot);
app.use('/sounds', (req, res) => {
	res.sendFile(
		path.join(rootPath, req.path),
		(err) => console.log(`Couldn't send file: ${err}`));
})

app.listen(port, () => {
	files.init();
	files.registerSound(new files.SoundInfo("test.mp3", "dod"))
	files.registerSound(new files.SoundInfo("test2.mp3", "malice"))
	console.log(`Server listening on ${port}`)
})
