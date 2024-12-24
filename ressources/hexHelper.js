const convert = (from, to) => (str) => {
	return Buffer.from(str, from).toString(to);
};
module.exports = {
	convert,
	utf8ToHex: convert("utf8", "hex"),
	hexToUtf8: convert("hex", "utf8"),
};
