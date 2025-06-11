var cors = require("cors");
const { URL } = require("url");

const crossOrigin = cors({
	origin: (origin, callback) => {
		if (!origin) {
			// Allow non-browser requests like Postman
			return callback(null, true);
		}

		const allowedDomains = [
			"luniversdemm.store",
			"localhost:8080",
			"localhost:4201",
		];

		let hostname;
		try {
			hostname = new URL(origin).host; // Extracts "study.luniversdemm.store" or "localhost:8080"
		} catch (err) {
			return callback(new Error("Invalid origin"));
		}

		const isAllowed = allowedDomains.some((allowedDomain) => {
			if (allowedDomain.startsWith("localhost")) {
				return hostname === allowedDomain; // exact match for localhost with port
			}
			return (
				hostname === allowedDomain || hostname.endsWith(`.${allowedDomain}`)
			); // allows main domain and subdomains
		});

		if (isAllowed) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
	allowedHeaders: "Authorization, Content-Type",
	// credentials: true, // Uncomment if you need cookies/credentials
});

module.exports = { crossOrigin };
