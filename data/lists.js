const fs = require("node:fs");
const DATASOURCE = "assets/database/db.json";

const getRecords = () => {
	return JSON.parse(fs.readFileSync(DATASOURCE));
};
const getById = (id) => {
	const result = [];
	const records = getRecords();
	Object.entries(records).forEach(([k, e]) => {
		e.forEach((e2) => {
			result.push(e2);
		});
	});

	return result.find((x) => x.id == id);
};

module.exports = {
	getRecords,
	getById,
};
