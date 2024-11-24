const fs = require("node:fs");
const { writeRessource } = require("../file-utils");
const DATASOURCE = "assets/database/db.json";
// Methods to be executed on routes
const getAll = (req, res) => {
	res.send(JSON.parse(fs.readFileSync(DATASOURCE)));
};
const findOne = (id) => {
	const records = JSON.parse(fs.readFileSync(DATASOURCE));
	const result = [];
	Object.entries(records).forEach(([k, e]) => {
		e.forEach((e2) => {
			result.push(e2);
		});
	});
	return result.find((x) => (x.id = id));
};
const getOne = (req, res) => {
	const { id } = req.params;

	res.send(findOne(id));
};

const update = (req, res) => {
	const body = req.body;
	const records = { ...JSON.parse(fs.readFileSync(DATASOURCE)) };

	Object.entries(records).forEach(([k, e]) => {
		const newArray = [];
		e.forEach((e2) => {
			if (e2.id == body.id) {
				e2 = body;
			}
			newArray.push(e2);
		});
		records[k] = newArray;
	});

	writeRessource(records, DATASOURCE);

	res.status(200).send();
};

const create = (req, res) => {
	const { global, rows } = req.body;
	const records = { ...JSON.parse(fs.readFileSync(DATASOURCE)) };
	/*
	Object.entries(records).forEach(([k, e]) => {
		records[k] = newArray;
	});*/

	//records[body.file] = newArray;

	if (!Object.keys(records).find((x) => x == global.file)) {
		const file = global.file;
		records[file] = rows;
	} else {
		const file = global.file;
		records[file].push(...rows);
	}

	writeRessource(records, DATASOURCE);

	//console.log(Object.keys(records));

	res.status(200).send();
};

// Export of all methods as object
module.exports = {
	getAll,
	getOne,
	update,
	create,
};
