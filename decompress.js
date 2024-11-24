const decompress = require("decompress");
const path = require("node:path");
const fs = require("fs");

const folder = "src/ressources/database";
const zipFile = path.join(folder, "data.zip");
const args = process.argv.filter((x) => /^--.+/.test(x));

decompress(zipFile, folder)
  .then((files) => {
    if (args.includes("--verbose")) {
      console.log(files);
    }

    if (args.includes("--clear")) {
      fs.unlinkSync(zipFile);
    }
  })
  .catch((error) => {
    console.log(error);
  });
