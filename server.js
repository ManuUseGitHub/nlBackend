const express = require("express");
var cors = require("cors");

require("dotenv/config");
// Initialization
const listes = "./routes/listRoute.js";
const presets = "./routes/presetRoute.js";
const filters = "./routes/filterRoute.js";

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/", require(listes));
app.use("/presets", require(presets));
app.use("/filters", require(filters));

app.listen(PORT, (error) => {
	if (!error)
		console.log(
			"Server is Successfully Running, and App is listening on port " + PORT
		);
	else console.log("Error occurred, server can't start", error);
});
