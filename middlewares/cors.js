var cors = require("cors");
const crossOrigin = cors({
	origin: (origin, callback) => {
		if (!origin) {
			// Allow non-browser requests like Postman
			return callback(null, true);
		}

		const allowedDomains = [
			/\.luniversdemm\.store$/, // Matches subdomains like sub.example.com
			"https://luniversdemm.store", // Matches the main domain
			/localhost:(8080|4201)$/, // all localhost whith matching ports
		];

		const isAllowed = allowedDomains.some((allowedDomain) => {
			if (typeof allowedDomain === "string") {
				return origin === allowedDomain; // Exact match
			}
			return allowedDomain.test(origin); // Regex match for subdomains
		});

		if (isAllowed) {
			callback(null, true); // Allow the request
		} else {
			callback(new Error("Not allowed by CORS")); // Deny the request
		}
	},
	methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
	allowedHeaders: "Authorization, Content-Type",
	//credentials: true, // If cookies or credentials are required
});

module.exports = { crossOrigin };
