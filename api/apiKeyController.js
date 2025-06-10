const fs = require("node:fs");
const DATASOURCE = "assets/database/apiKeys.json";
const { saveToDB, destroyKey } = require("../lib/key");

// Methods to be executed on routes
const update = (req, res) => {
	req.text = "";
	req.setEncoding("utf8");
	req.on("data", function (chunk) {
		req.text += chunk;
	});
	req.on("end", (_) => {
		const receivedKey = JSON.parse(req.text, "utf-8");
		saveToDB(receivedKey);

		res.status(201);
		res.send("");
	});
};

const getKey = (req, res) => {
	const { encrypted, valid } = JSON.parse(fs.readFileSync(DATASOURCE) || "");
	res.send({ encrypted, valid });
};

const deleteKey = (req, res) => {
	destroyKey();
	res.status(201);
	res.send("");
};

module.exports = {
	update,
	getKey,
	deleteKey,
};
