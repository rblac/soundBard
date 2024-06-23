const http = require('node:http')
const express = require('express')
const { port, botUrl, selfUrl } = require('../config.json');

const app = express();

function createPlayCommand(soundUrl) {
	return {
		type: 'play',
		soundUrl: soundUrl
	}
}

app.get("/", (req, res) => {
	res.send("hola mundo")
	res.end();
});

app.get("/test", (req, res) => {
	fetch(new Request(botUrl, {
		method: 'POST',
		body: JSON.stringify(createPlayCommand(`${selfUrl}:${port}/sounds/test2.mp3`))
	}))
	console.log(`sent req to ${botUrl}`)
	res.status(200);
	res.end();
});

app.use('/sounds', express.static("./sounds"))
app.listen(port, () => { console.log(`Server listening on ${port}`) })
