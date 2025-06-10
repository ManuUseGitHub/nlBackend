const extractTextsAndExpectationsFromFile = (file) => {
	const testP =
		/--(?<nature>TEXT|RESULT)(?:(?<id>.*))(?:[\n\r](?<text>[^\-]*)|)/gm;
	let m;
	const texts = {};
	const results = {};
	while ((m = testP.exec(file))) {
		const { nature, id, text } = m.groups;
		if (nature.toLowerCase() == "text") {
			texts[id] = text;
		} else if (nature.toLowerCase() == "result") {
			results[id] = text;
		}
	}

	return { texts, results };
};

module.exports = { extractTextsAndExpectationsFromFile };
