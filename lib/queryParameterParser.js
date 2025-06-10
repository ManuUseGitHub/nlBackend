const extractMatchingQuery = (entry, queryP, matched) => {
	const { rule, flags } = matched.groups;
	let result = "";
	if (new RegExp(`(\\?\\<${queryP}\\>)`).test(rule)) {
		const m = new RegExp(rule, flags).exec(entry);
		if (m) result = m.groups[queryP];
	} else {
		// filters on query
		const m = new RegExp(rule, flags).exec(entry);
		if (m) {
			result = Object.entries(m.groups).filter(([k, v]) => v)[0][0];
		}
	}
	return result;
};

const computeFromQParameter = (entry, queryP, value) => {
	let matched = /^~\/(?<rule>.+)\/(?<flags>.*)$/.exec(value);
	return !matched ? value : extractMatchingQuery(entry, queryP, matched);
};

module.exports = {
	computeFromQParameter,
};
