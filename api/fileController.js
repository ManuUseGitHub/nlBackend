const { getMockedTranslate } = require("../lib/mock");
const { computeFromQParameter } = require("../lib/queryParameterParser");
const { EntriesBuilder } = require("../lib/text");
const { translate } = require("../lib/translateRequester");
// Methods to be executed on routes

const generateDutchEntry = (req, line = { dutch: "", french: "" }) => {
	console.log(req.query);
	Object.entries(req.query).forEach((queryParameter) => {
		const [name, value] = queryParameter;

		const valueDecoded = decodeURI(decodeURI(value));
		const matchMeta = /^_(?<queryP>.+)/.exec(name);
		if (!matchMeta) {
			const normalizedName = name.replace("!", "");

			line[normalizedName] = computeFromQParameter(
				line.dutch,
				name,
				valueDecoded
			);
		} else {
			const queryP = matchMeta.groups.queryP;
			const val = line[queryP];
			if (val != undefined) {
				valueDecoded.split(":").forEach((x) => {
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

const extractDirection = (req) => {
	let direction = "en-GB";
	const reforgedQuery = {};
	Object.entries(req.query).forEach((queryParameter) => {
		const [name, value] = queryParameter;
		if (name == "direction") {
			direction = decodeURI(value);
		} else {
			reforgedQuery[name] = decodeURI(value);
		}
	});
	delete req.query.direction;
	req.query = reforgedQuery;

	return direction;
};
const getCSV = async (req, res) => {
	const direction = extractDirection(req);
	const headers = Object.keys(generateDutchEntry(req));

	const lines = [headers.join(";")];
	if (req.is("text/*")) {
		req.text = "";
		req.setEncoding("utf8");
		req.on("data", function (chunk) {
			req.text += chunk;
		});
		req.on("end", async (_) => {
			await giveLines(req, headers, direction, lines, req.text);
			res.send({ csv: lines.join("\n") });
		});
	} else {
		await giveLines(req, headers, direction, lines, req.body.text);
		res.set({
			"Content-Disposition": 'attachment; filename="Hello.csv"',
		});
		res.send({ csv: lines.join("\n") });
	}
};

const giveLines = async (req, headers, direction, lines, text) => {
	const entries = new EntriesBuilder(text)
		.escapeLitteralSrings()
		.cutSentences()
		.build();

	let translated;

	const { source, target } = /^(?<source>[^:]*):(?<target>[^\:]*)$/.exec(
		direction
	).groups;

	//translated = await getMockedTranslate();
	translated = await translate(entries.join("\n"), source, target);

	entries.forEach((word, i) => {
		const entry = generateDutchEntry(req, {
			dutch: word,
			french: translated.text.split("\n")[i],
		});
		lines.push(
			Object.values(headers)
				.map((k) => entry[k])
				.join(";")
		);
	});
};

// Export of all methods as object
module.exports = {
	getCSV,
};
