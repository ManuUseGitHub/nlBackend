const deepl = require("deepl-node");
const { getApyKey } = require("./key");

const translate = async (text, source, target) => {
	const decryptedApiKey = getApyKey();
	const translator = new deepl.Translator(decryptedApiKey);

	return await translator.translateText(text, source, target);
};

module.exports = {
	translate,
};
