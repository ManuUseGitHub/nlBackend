const fs = require("node:fs");
const { writeRessource } = require("../file-utils");
const { v4 } = require("uuid");
const { exit } = require("node:process");
const DATASOURCE = "assets/database/db.json";

// Methods to be executed on routes
const getAll = (req, res) => {
	res.send(JSON.parse(fs.readFileSync(DATASOURCE)));
};
const findOne = (id) => {
	const records = JSON.parse(fs.readFileSync(DATASOURCE));
	return records.find((x) => (x.id = id));
};
const getOne = (req, res) => {
	const { id } = req.params;

	res.send(findOne(id));
};

const update = (req, res) => {
	const { file, rows } = req.body;
	const records = JSON.parse(fs.readFileSync(DATASOURCE));

	const candidates = {};
	rows.forEach((x) => {
		candidates[x.id] = x;
	});
	const changed = records.map((x) => {
		const candidate = candidates[x.id];
		if (candidate) {
			fixFile(candidate, file);
			fixFlags(candidate);
		}

		return candidate || x;
	});

	writeRessource(changed, DATASOURCE);
	res.status(200).send();
};

const sameIssuer = (x, entry) => (entry.issuer ? entry.issuer : "") == x.issuer;
const remove = (req, res) => {
	const body = req.body;
	const records = JSON.parse(fs.readFileSync(DATASOURCE));
	console.log(body);
	// read by files
	const filtered = records.filter((e2) => {
		return !body.find((x) => x.id == e2.id && sameIssuer(x, e2));
	});

	writeRessource(filtered, DATASOURCE);
	res.status(200).send();
};
const fixFile = (candidate, file) => {
	if (!candidate.file || /^undefinded$/.test(candidate.file)) {
		candidate.file = file;
	}
	return candidate;
};
const fixFlags = (card) => {
	const properties = [
		"forModification",
		"forAttention",
		"forDeletion",
		"forValidation",
	];
	properties.forEach((prop) => {
		if (isNaN(parseInt(`${card[prop]}`))) {
			card[prop] = 0; // FLAGS.UNSET
		}
	});
	return card;
};
const migrateToList = (req, res) => {
	const result = [];
	Object.entries({ ...JSON.parse(fs.readFileSync(DATASOURCE)) }).forEach(
		([k, lines]) => {
			lines.forEach((r) => {
				if (!r.file) {
					r["file"] = k;
				}

				result.push(fixFlags(r));
			});
		}
	);

	writeRessource(result, DATASOURCE);
	res.status(200).send();
};
const repearIds = (req, res) => {
	const records = JSON.parse(fs.readFileSync(DATASOURCE));

	Object.entries(records).forEach((e2) => {
		if (!e2.id) {
			e2.id = v4();
		}
	});

	writeRessource(records, DATASOURCE);
	res.status(200).send();
};

const create = (req, res) => {
	const { file, rows } = req.body;
	const entries = JSON.parse(fs.readFileSync(DATASOURCE));
	console.log(file);

	entries.push(
		...rows.map((r) => {
			r.id = v4();
			r["date"] = new Date();
			if (!r.file) {
				r.file = file;
			}
			return r;
		})
	);

	writeRessource(entries, DATASOURCE);
	res.status(200).send();
};

// Export of all methods as object
module.exports = {
	getAll,
	getOne,
	update,
	repearIds,
	create,
	remove,
	migrateToList,
};
