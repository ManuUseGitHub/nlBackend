const { translate } = require("../lib/translateRequester");

const getTranslated = async (text, sourceLang, targetLang) => {
	return await translate(text, sourceLang, targetLang);
};

const getTranslation = async (req, res) => {
	req.text = "";
	req.setEncoding("utf8");
	req.on("data", function (chunk) {
		req.text += chunk;
	});
	req.on("end", async (_) => {
		const params = {};
		Object.entries(req.query).forEach((queryParameter) => {
			const [name, value] = queryParameter;
			params[name] = value;
		});

		const { source, target } = /^(?<source>[^:]*):(?<target>[^\:]*)$/.exec(
			params.direction
		).groups;

		let result //= { text: "hello worked" };

		//console.log(source, target);
		result = await getTranslated(
			req.text,
			source ? source : null,
			target ? target : "en-US"
		);

		res.send(result);
	});
};

module.exports = {
	getTranslation,
};
