const fs = require("node:fs");
const { getEntriesByFilenames } = require("../fileNames");
const { addToRecords } = require("../entries");
const data = JSON.parse(
	fs.readFileSync("assets/tests/sampleOf5NewEntriesWithDifferentFiles.json")
);
const records = JSON.parse(
	fs.readFileSync("assets/tests/existingDataSample.json")
);
it("can add new entries to different files", () => {
	const patch = getEntriesByFilenames(data);
	const newVersion = addToRecords(records, patch);
	expect(Object.entries(newVersion).length).not.toBe(
		Object.entries(records).length
	);
});

const staticDutch = [];
Object.entries(records).forEach(([k, v]) => {
	staticDutch.push(
		v.map((element) => {
			const dutch = element.dutch;
			return [`we can still find ${dutch}`, k, dutch];
		})
	);
});

describe("upon addition, ", () => {
	it.each(staticDutch.flat())("%s", (_, key, dutch) => {
		const patch = getEntriesByFilenames(data);
		const newVersion = addToRecords(records, patch);
        const foundIndex = newVersion[key].findIndex((x) => x.dutch == dutch);;
		expect(foundIndex).not.toBe(-1);
	});
});
