const fs = require("node:fs");
const ALGORITHM = "aes-256-gcm";
const crypto = require("crypto");
const KEY_LENGTH = parseInt(process.env.KEY_LENGTH || "16");
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || "60000");
// Compute the index based on current UTC time and a minute-based interval
function getTimeWindowIndex(keyVersion) {
	const now = new Date(keyVersion); // current UTC timestamp in milliseconds
	const interval = Math.floor(now / INTERVAL_MS); // which time bucket we're in
	const number = interval;
	const maxStart = JSON.parse(fs.readFileSync("./key.json", "utf8")).key.length;
	const index = number % maxStart;
	return index;
}

function getExceeded(base, index) {
	const length = KEY_LENGTH;
	const len = base.length;
	return index + length > len ? base.substring(0, index + length - len) : "";
}
function getSecret(keyVersion) {
	const length = KEY_LENGTH;
	const base = JSON.parse(fs.readFileSync("./key.json", "utf8")).key;
	const index = getTimeWindowIndex(keyVersion);
	return (
		base.substring(index, index + length) + getExceeded(base, index, length)
	);
}
function encryptData(data, key) {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(data, "utf8"),
		cipher.final(),
	]);
	const authTag = cipher.getAuthTag();

	return {
		encrypted: Buffer.concat([iv, authTag, encrypted]).toString("base64"),
	};
}

function decryptData(keyVersion, encrypted) {
	const secret = getSecret(keyVersion);
	const hash = crypto.createHash("sha256").update(secret).digest();

	const key = hash.slice(0, 32);
	const iv = hash.slice(32 - 12);

	const data = Buffer.from(encrypted, "base64");

	const authTag = data.slice(data.length - 16);
	const ciphertext = data.slice(0, data.length - 16);

	const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]);
	return decrypted.toString("utf8");
}

// Converts your secret string (from getSecret) to a 256-bit AES key
function getAesKey(secretString) {
	const hash = crypto.createHash("sha256").update(secretString).digest();
	return hash.subarray(0, 32); // 256-bit key
}

// Generates encryption metadata
function getEncryptionMetadata() {
	const date = new Date();
	return {
		keyVersion: date.getTime().toString(), // Timestamp
		keyDate: date.toISOString().slice(0, 10), // ISO date string
	};
}

module.exports = {
	getSecret,
	getAesKey,
	decryptData,
	encryptData,
	getEncryptionMetadata,
};
