const fs = require("node:fs");
const DATASOURCE = "assets/database/filters/presets.json";

// Methods to be executed on routes
const getAll = (req, res) => {
	res.send(JSON.parse(fs.readFileSync(DATASOURCE)));
};

const create = (req, res) => {
	const records = JSON.parse(fs.readFileSync(DATASOURCE));
	const body = req.body;

	records.push({
		id: Math.max(...records.map((x) => x.id)) + 1,
		...body,
	});

	fs.writeFile(DATASOURCE, JSON.stringify(records), () => {
		res.send();
	});
};

const suppress = (req, res) => {
	const records = JSON.parse(fs.readFileSync(DATASOURCE));
	const { id } = req.params;

	const altered = records.filter((x) => x.id != id);

	fs.writeFile(DATASOURCE, JSON.stringify(altered), () => {
		res.send();
	});
};

// Export of all methods as object
module.exports = {
	getAll,
	create,
	delete: suppress,
};
