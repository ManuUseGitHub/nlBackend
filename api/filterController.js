const fs = require("node:fs");
const { replaceCharacteristics } = require("../characteristicsSync");

// Methods to be executed on routes
const update = (req, res) => {
	replaceCharacteristics((chars) => {
		res.send(
			chars
			/*JSON.parse(
				fs.readFileSync("assets/database/filters/characteristics.json")
			)*/
		);
	});
};

const getAll = (req, res) => {
	res.send(
		JSON.parse(fs.readFileSync("assets/database/filters/characteristics.json"))
	);
};

// Export of all methods as object
module.exports = {
	update,
	getAll,
};
