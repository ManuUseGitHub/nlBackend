const getDifferentFilenames = (data) => {
	const files = new Set([
		// storing the global file name
		data.file,

		// for each entry, we check the existance of a defined file name
		...data.rows.map((row) => row.file).filter(Boolean),
	]);
	return Array.from(files);
};

const getEntriesByFilenames = (data) => {
	const patch = {};
	const { rows, file: defaultFile } = data;
	getDifferentFilenames(data).forEach((file) => {
		patch[file] = [];
	});
	rows.forEach((x) => {
		const fileName = x.file != undefined ? x.file : defaultFile;
		patch[fileName].push(x);
	});
	return patch;
};

module.exports = {
	getDifferentFilenames,
	getEntriesByFilenames,
};
