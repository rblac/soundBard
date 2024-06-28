const { filesRoot, configRoot } = require('../config.json');
const fs = require('node:fs')
const path = require('node:path')

// Bardzo prosty mechanizm; Na potrzeby tego projektu zdecydowanie wystarcza,
// ale kompozycja modułu daje możliwość wprowadzenia skalowalności w przyszłości.
var db = new Map();
const rootDir = path.join(__dirname, filesRoot);
const rootDirConf = path.join(__dirname, configRoot);
var dbFile = path.join(rootDirConf, "db-sounds.json");
var userFile = path.join(rootDirConf, "users.json");
var users = { admins: [] };

class SoundInfo {
	constructor(path, author, communal = false) {
		this.path = path;
		this.author = author;
		this.communal = false; // `public` is a reserved word in js lmao
	}
}

function init() {
	try {
		const data = fs.readFileSync(dbFile);
		db = new Map(JSON.parse(data));
	} catch(err) { console.error(`Failed to load db: ${err}`); }
	try {
		const u = fs.readFileSync(userFile);
		users = JSON.parse(u);
	} catch(err) { console.error(`Failed to load users: ${err}`); }
}
function writeDB() {
	fs.writeFile(dbFile,
		JSON.stringify(Array.from(db.entries())),
		(err) => { if(err) throw err; });
}

function userIsAdmin(user) { return users.admins.includes(user) }
function userCanManage(sound, user) {
	return sound.author == user || userIsAdmin(user);
}
function userCanSee(sound, user) {
	return sound.communal || sound.author == user || userIsAdmin(user);
}

function writeSound(name, buf) {
	var p = path.join(rootDir, name);
	var fileName = name;
	let i = 0;
	do {
		fileName = name+'.'+(++i).toString();
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

	info.id = id;
	db.set(id, info);
	writeDB();

	return id;
}
function eraseSound(user, id) {
	console.log(`erasing ${id}`)
	if(!userCanManage(db.get(id), user)) return false;
	try {
		const p = path.join(rootDir, db.get(id).path);
		fs.rmSync(p);
		db.delete(id);
		writeDB();
		return true;
	} catch(e) {
		console.error(`failed to erase sound: ${e}`);
		return false;
	}
}
function setSoundVis(user, id, isPublic) {
	console.log(`setting ${id} to ${isPublic}`)
	if(userCanManage(db.get(id), user)) {
		db.get(id).communal = isPublic;
		writeDB();
		return true;
	} else return false;
}

function listSounds(user) {
	return Array.from(db.values())
		.filter((s) => userCanSee(s, user))
		.map(s => { let z = new Object(s); z.canManage = userCanManage(s, user); return z; })
}
function getSoundFilename(id) { return db.get(id).path }

module.exports = {
	SoundInfo,
	init,
	writeSound,
	registerSound,
	eraseSound,
	setSoundVis,
	listSounds,
	getSoundFilename,
}
