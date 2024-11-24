const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.filter((x) => /^--.+/.test(x));

const getFilesSource = (folder, ext) =>
	fs
		.readdirSync(folder, { withFileTypes: true })
		.filter((x) => x[Object.getOwnPropertySymbols(x)[0]] == 1)
		.filter((x) => !/^\./.test(x.name))
		.filter((x) => new RegExp(`\.${ext}$`).test(x.name))
		.map((x) => path.join(x.parentPath, x.name));

const writeRessource = (data, fileName, cb = (data) => {}) => {
	fs.writeFile(
		fileName,
		args.includes("--pretty")
			? JSON.stringify(data, null, 2)
			: JSON.stringify(data),
		(err) => {
			if (err) {
				console.error(err);
			} else {
				console.log("finished !");
				cb(data);
			}
		}
	);
};

module.exports = { getFilesSource, writeRessource };
