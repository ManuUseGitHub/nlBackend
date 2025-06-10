const express = require("express");
var cors = require("cors");
const btaatob = require("./ressources/hexHelper");
const { crossOrigin } = require("./middlewares/cors");
const { logging } = require("./middlewares/logger");
const { accessControl } = require("./middlewares/access");

require("dotenv/config");
// Initialization
const listes = "./routes/listRoute.js";
const presets = "./routes/presetRoute.js";
const filters = "./routes/filterRoute.js";
const keys = "./routes/apiKeyRoute.js";
const generator = "./routes/keyGeneratorRoute.js";
const files = "./routes/fileRoute.js";
const translation = "./routes/translationRoute.js";
const app = express();
const PORT = process.env.PORT;
const API_VERSION_ID = btaatob.utf8ToHex(process.env.API_SUB_PATH);
console.log(API_VERSION_ID, "ENVIRONMENT:", process.env.NODE_ENV);

// CORS middleware
app.use(
	logging,
	crossOrigin,

	// Authorization middleware (after CORS)
	accessControl
);

// JSON body parsing middleware
app.use(express.json());

app.use("/" + API_VERSION_ID, require(listes));
app.use("/" + process.env.API_SUB_PATH, require(listes));

app.use("/" + API_VERSION_ID + "/presets", require(presets));
app.use("/" + process.env.API_SUB_PATH + "/presets", require(presets));

app.use("/" + API_VERSION_ID + "/filters", require(filters));
app.use("/" + process.env.API_SUB_PATH + "/filters", require(filters));

app.use("/" + API_VERSION_ID + "/keys", require(keys));
app.use("/" + process.env.API_SUB_PATH + "/keys", require(keys));

app.use("/" + API_VERSION_ID + "/generator", require(generator));
app.use("/" + process.env.API_SUB_PATH + "/generator", require(generator));

app.use("/" + API_VERSION_ID + "/files", require(files));
app.use("/" + process.env.API_SUB_PATH + "/files", require(files));

app.use("/" + API_VERSION_ID + "/translation", require(translation));
app.use("/" + process.env.API_SUB_PATH + "/translation", require(translation));

// Handle preflight requests
app.options("*", cors());

app.listen(PORT, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running, and App is listening on port " + PORT
		);
	else console.log("Error occurred, server can't start", error);
});
