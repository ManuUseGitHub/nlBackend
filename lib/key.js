const fs = require("node:fs");
const { decryptData } = require("./security/security");
const DATASOURCE = "assets/database/apiKeys.json";

const GENERATION_LENGTH = parseInt(process.env.GENERATION_LENGTH || "1024");

function makeBaseString(length = GENERATION_LENGTH) {
	var result = "";
	var characters =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+-={}[]:;?,.|\\";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function getApyKey() {
	const storedKey = fs.readFileSync("assets/database/apiKeys.json");
	const { keyVersion, encrypted } = JSON.parse(storedKey, "utf-8");
	return decryptData(keyVersion, encrypted);
}

function saveToDB(keyMetadata) {
	fs.writeFileSync(DATASOURCE, JSON.stringify(keyMetadata));
}

function destroyKey() {
	fs.unlinkSync(DATASOURCE);
}

module.exports = {
	makeBaseString,
	saveToDB,
	getApyKey,
	destroyKey,
};
