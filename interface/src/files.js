const { filesRoot } = require('../config.json');
const fs = require('node:fs')
const path = require('node:path')

// Bardzo prosty mechanizm; Na potrzeby tego projektu zdecydowanie wystarcza,
// ale kompozycja modułu daje możliwość wprowadzenia skalowalności w przyszłości.
var db = new Map();
const rootDir = path.join(__dirname, filesRoot);
var dbFile = path.join(rootDir, "db.json");

class SoundInfo {
	constructor(path, author) {
		this.path = path;
		this.author = author;
	}
}

function init() {
	try {
		const data = fs.readFileSync(dbFile);
		db = new Map(JSON.parse(data));
	} catch(err) {
		console.error(`Failed to read DB file: ${err}`);
	}
}
function writeDB() {
	fs.writeFile(dbFile,
		JSON.stringify(Array.from(db.entries())),
		(err) => { if(err) throw err; });
}

function writeSound(name, buf) {
	const p = path.join(rootDir, name);
	fs.writeFile(p, buf,
		(err) => { if(err) console.error(`failed to write sound '${name}': ${err}`) });
	return p;
}
function registerSound(info, id = null) {
	console.log(Array.from(db.entries()))
	console.log(`adding ${info.path}`)
	if(id == null) id = db.size;
	console.log(Array.from(db.entries()))

	db.set(id, info);
	writeDB();

	return id;
}
function listSounds(user) {
	// no user auth for now
	return Array.from(db.values());
}
function getSoundPath(id) {
	return db[id].path
}

module.exports = {
	SoundInfo,
	init,
	writeSound,
	registerSound,
	listSounds,
	getSoundPath,
}
