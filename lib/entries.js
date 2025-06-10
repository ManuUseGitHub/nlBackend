const addToRecords = (records, data) => {
	const files = Object.keys(records);
	const copy = { ...records };
	Object.entries(data).forEach(([file, entries]) => {
		if (!files.includes(file)) {
			copy[file] = [];
		}
		copy[file].push(entries);
	});
	return copy;
};

module.exports = {
	addToRecords,
};
