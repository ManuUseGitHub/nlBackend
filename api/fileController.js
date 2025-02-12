const fs = require("node:fs");
const { computeFromQParameter } = require("../lib/queryParameterParser");

// Methods to be executed on routes

const generateDutchEntry = (req, word) => {
	const line = { dutch: word };
	Object.entries(req.query).forEach((queryParameter) => {
		const [name, value] = queryParameter;
		const matchMeta = /^_(?<queryP>.+)/.exec(name);
		if (!matchMeta) {
			const normalizedName = name.replace("!", "");
			line[normalizedName] = computeFromQParameter(word, name, value);
		} else {
			const queryP = matchMeta.groups.queryP;
			const val = line[queryP];
			if (val != undefined) {
				value.split(":").forEach((x) => {
					switch (x) {
						case "flower":
							line[queryP] = val.toLowerCase();
							break;
						case "fupper":
							line[queryP] = val.toUpperCase();
							break;
						case "fcapital":
							line[queryP] =
								String(val).charAt(0).toUpperCase() + String(val).slice(1);
							break;
						case "spaned":
							line[queryP] = `<span class="${val.toLowerCase()}">${val}</span>`;
							break;
						case "sbetween":
							line[queryP] = val.split(/()/g).join(" ");
							break;
					}
				});
			}
		}
	});
	return Object.assign({}, line);
};

const textToEntries = (text) => {
	return text
		.replace(";", "\u{FE54}")
		.replace(/\\,/gm, "\u{FE50}")
		.replace(/[\n\r]+/gm, ",")
		.replace(/\,{2,}/gm, ",")
		.replace(/,\s*/gm, "; ")
		.split("; ");
};

const getCSV = (req, res) => {
	if (req.is("text/*")) {
		req.text = "";
		req.setEncoding("utf8");
		req.on("data", function (chunk) {
			req.text += chunk;
		});
		req.on("end", (_) => {
			const headers = Object.keys(generateDutchEntry(req, ""));
			const lines = [headers.join(";")];

			textToEntries(req.text).forEach((word) => {
				const entry = generateDutchEntry(req, word);
				lines.push(
					Object.values(headers)
						.map((k) => entry[k])
						.join(";")
				);
			});
			res.set({
				"Content-Disposition": 'attachment; filename="Hello.csv"',
			});
			res.send(lines.join("\n"));
		});
	} else {
		res.json("");
	}
};

// Export of all methods as object
module.exports = {
	getCSV,
};
