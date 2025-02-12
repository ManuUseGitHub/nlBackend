const express = require("express");
var cors = require("cors");
const btaatob = require("./ressources/hexHelper");

require("dotenv/config");
// Initialization
const listes = "./routes/listRoute.js";
const presets = "./routes/presetRoute.js";
const filters = "./routes/filterRoute.js";
const files = "./routes/fileRoute.js";

const app = express();
const PORT = process.env.PORT;
const API_VERSION_ID = btaatob.utf8ToHex(process.env.API_SUB_PATH);
console.log(API_VERSION_ID);

// CORS middleware
app.use(
	cors({
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
	})
);

// Handle preflight requests
app.options("*", cors());

// Authorization middleware (after CORS)
app.use((req, res, next) => {
	const bearer = req.headers.authorization;
	if (!bearer || bearer !== "Bearer " + process.env.ACCESS_TOKEN) {
		return res.status(403).json({
			message: "Forbidden resource",
			error: "Forbidden",
			statusCode: 403,
		});
	}
	next();
});

// JSON body parsing middleware
app.use(express.json());

app.use("/" + API_VERSION_ID, require(listes));
app.use("/" + process.env.API_SUB_PATH, require(listes));

app.use("/" + API_VERSION_ID + "/presets", require(presets));
app.use("/" + process.env.API_SUB_PATH + "/presets", require(presets));

app.use("/" + API_VERSION_ID + "/filters", require(filters));
app.use("/" + process.env.API_SUB_PATH + "/filters", require(filters));

app.use("/" + API_VERSION_ID + "/files", require(files));
app.use("/" + process.env.API_SUB_PATH + "/files", require(files));

app.listen(PORT, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running, and App is listening on port " + PORT
		);
	else console.log("Error occurred, server can't start", error);
});
