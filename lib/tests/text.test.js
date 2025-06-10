const { EntriesBuilder } = require("../text");
const fs = require("node:fs");
const { extractTextsAndExpectationsFromFile } = require("./testsUtils");
const { describe } = require("node:test");

const file = fs.readFileSync("assets/tests/texts.txt", "utf8");
const { texts, results } = extractTextsAndExpectationsFromFile(file);

it("It keeps litteral texts", () => {
	expect(new EntriesBuilder(texts[1]).escapeLitteralSrings().toString()).toBe(
		results[1].trim()
	);
});

it("Contains double quotes", () => {
	const entries = new EntriesBuilder(texts[2]).escapeLitteralSrings().build();
	expect(entries.at(0)).toBe(results[2].trim());
});

describe("We expected it ", () => {
	test.each([
		["cut sentences", 3],
		["keeps abreviations from cutting into sentences", 4],
	])("%s", (_, case_) => {
		const result = new EntriesBuilder(texts[case_])
			.escapeLitteralSrings()
			.cutSentences()
			.toString();
		expect(result).toBe(results[case_].trim());
	});
});
