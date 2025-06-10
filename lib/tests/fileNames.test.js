const fs = require("node:fs");
const {
	getDifferentFilenames,
	getEntriesByFilenames,
} = require("../fileNames");
const { describe } = require("node:test");
const data = JSON.parse(
	fs.readFileSync("assets/tests/sampleOf5NewEntriesWithDifferentFiles.json")
);
describe("entries division in fileNames", () => {
	it("should give 4 different fileNames", () => {
		expect(getDifferentFilenames(data).length).toBe(4);
	});
});
describe("should give a patch with matching", () => {
	it.each([
		["_D20250219T041445", 2, "_D20250219T041445"],
		["Eten & drinken", 1, "Eten & drinken"],
		["alternative", 1, "alternative"],
		["newFile", 1, "newFile"],
	])("%s should be %d", (_, count, file) => {
		const patch = getEntriesByFilenames(data);
		expect(patch[file].length).toBe(count);
	});
});
