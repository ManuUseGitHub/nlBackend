const express = require("express");
var cors = require("cors");

require("dotenv/config");
// Initialization
const listes = "./routes/listRoute.js";
const presets = "./routes/presetRoute.js";
const filters = "./routes/filterRoute.js";

const app = express();
const PORT = process.env.PORT;
const API_VERSION_ID = "api/V1";

// Middlewares
app.use(
	cors({
		origin: ["*"],
		optionsSuccessStatus: 200, // For legacy browser support
	})
);
app.use(express.json());

app.use("/" + API_VERSION_ID, require(listes));
app.use("/" + API_VERSION_ID + "/presets", require(presets));
app.use("/" + API_VERSION_ID + "/filters", require(filters));

app.listen(PORT, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running, and App is listening on port " + PORT
		);
	else console.log("Error occurred, server can't start", error);
});
