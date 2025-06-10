const fs = require("node:fs");
const { makeBaseString } = require("../lib/key");
const GENERATION_LENGTH = process.env.GENERATION_LENGTH;

// Methods to be executed on routes
const generate = (req, res) => {
	const generated = makeBaseString(GENERATION_LENGTH);
	fs.writeFile(
		"./key.json",
		`{"key":"${generated.replace(/[/]/g, "\\/").replace(/[\\]/g, "\\\\")}"}`,
		() => {
			console.log("done:\n", generated);
			res.send();
		}
	);
};

module.exports = {
	generate,
};
