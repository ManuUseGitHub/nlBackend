const { getFilesSource } = require("./file-utils");
const fs = require("node:fs");
const args = process.argv.filter((x) => /^--.+/.test(x));
const folder = "./assets/database";
const paths = getFilesSource(folder, "json");

const getResetCharacteristics = () => {
	const collectionsNames = [
		"articles",
		"types",
		"themes",
		"parts",
		"chapters",
		"tags",
		"difficulties",
		"files",
	];
	const characteristics = require("./assets/database/filters/characteristics.json");
	collectionsNames.forEach((name) => {
		characteristics[name] = [];
	});
	return characteristics;
};

const pushNewCharacteristics = (name, characteristics, characteristic) => {
	if (!Array.isArray(characteristic)) {
		characteristics[name].push(characteristic);
	} else {
		characteristic.forEach((value) => {
			if (!characteristics[name].includes(value)) {
				characteristics[name].push(value);
			}
		});
	}
};

const getPluralKey = (name, characteristics) => {
	if (!(name in characteristics)) {
		return name + "s" in characteristics ? name + "s" : name;
	}
	return name;
};
const replaceCharacteristics = (cb) => {
	const characteristics = getResetCharacteristics();

	const dbFiles = paths.filter((name) => /^.*\/db[^\/]+$/.test(name));

	dbFiles.forEach((fileName) => {
		const data = JSON.parse(fs.readFileSync(fileName));
		let cpt = 0;
		Object.entries(data).map(([key, entry]) => {
			try {
				Object.keys(entry).forEach((c) => {
					const characteristic = entry[c];
					const matching = getPluralKey(c, characteristics);
					if (
						matching in characteristics &&
						entry[c] &&
						!characteristics[matching].includes(characteristic)
					) {
						pushNewCharacteristics(matching, characteristics, characteristic);
					}
				});
			} catch (err) {
				if (cpt++ == 0) {
					console.log(err, key, entry);
				}
			}
		});
	});
	fs.writeFile(
		"./assets/database/filters/characteristics.json",
		args.includes("--pretty")
			? JSON.stringify(characteristics, null, 2)
			: JSON.stringify(characteristics),
		(err) => {
			if (err) {
				console.error(err);
			} else {
				//console.log("finished !");
				cb(characteristics);
			}
		}
	);
};

module.exports = {
	pushNewCharacteristics,
	getResetCharacteristics,
	replaceCharacteristics,
};
