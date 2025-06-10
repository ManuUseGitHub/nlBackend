const fs = require("fs");
const audit = require("express-requests-logger");
const { environments } = require("../ressources/constents");

const logging = audit({
	shouldSkipAuditFunc: function (req, res) {
		// Custom logic here.. i.e: return res.statusCode === 200
		const shouldSkip =
			process.env.NODE_ENV != environments.DEVELOPMENT &&
			res.statusCode === 200;
		if (!shouldSkip) {
			var now = new Date();
			var logfile_name =
				now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
			if (!fs.existsSync("Logs")) {
				fs.mkdirSync("Logs");
			}
			try {
				fs.appendFileSync(
					"Logs/" + logfile_name,
					JSON.stringify(req.body) +
						"\n\n[RECEIVED" +
						Date.now() +
						"]:\n\n" +
						req.text
				);
			} catch (err) {
				fs.appendFileSync("Logs/" + logfile_name, err);
			}
		}

		return false;
	},
});

module.exports = { logging };
