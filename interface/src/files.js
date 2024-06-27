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
	var p = path.join(rootDir, name);
	var fileName = name;
	let i = 0;
	do {
		fileName = name+(++i).toString();
		p = path.join(rootDir, fileName);
	}
	while(fs.existsSync(p)) 
	fs.writeFile(p, buf,
		(err) => { if(err) console.error(`failed to write sound '${name}': ${err}`) });
	return fileName;
}
function registerSound(info, id = null) {
	if(id == null) id = db.size;
	if(info == null) {
		console.error("attempting to write null sound");
		return;
	}

	db.set(id, info);
	writeDB();

	return id;
}
function eraseSound(filename, _user) {
	try {
		const p = path.join(rootDir, filename);
		fs.rmSync(p);
		db.delete(filename);
		writeDB();
		return true;
	} catch(e) {
		console.error(`failed to erase sound: ${e}`);
		return false;
	}
}
function listSounds(user) {
	// no user auth for now
	return Array.from(db.values());
}

module.exports = {
	SoundInfo,
	init,
	writeSound,
	registerSound,
	eraseSound,
	listSounds,
}
