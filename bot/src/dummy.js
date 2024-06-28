/// Alternative mode; just plays the audio back in a browser tab
const { listenPort, dummyPort } = require('../config.json');

const http = require('node:http');
const path = require('node:path');
const express = require('express');

var playbackQueue = new Array();
function handleRequest(r) {
	switch(r.type) {
		case "play":
			playbackQueue.push(r.soundUrl);
			break;
		default:
			console.err(`Unrecognised server command type: ${r.type}`)
			break;
	}
}

const app = express();

app.get("/", (_, res) => {
	res.sendFile(path.join(__dirname, 'dummy.html'));
	clientStream = res;
})
app.get("/queued", (_, res) => {
	res.send(JSON.stringify(playbackQueue));
	playbackQueue = [];
})

app.listen(dummyPort, (hostname) => {
	console.log(`Dummy bot serving at ${hostname}, port ${dummyPort}`);
	// Start listening for server messages
	const botServ = http.createServer((req, res) => {
		var body = "";
		req.on('data', chunk => {
			body += chunk;
		}).on('end', () => {
			req = JSON.parse(body);
			handleRequest(req);
		})
		res.end()
	});
	botServ.listen(listenPort);
	console.log(`Listening on port ${listenPort}`);
})
