// npm i archiver
const archiver = require("archiver");
const fs = require("fs");
const { getFilesSource } = require("./file-utils");
const path = require("path");

const folder = "src/ressources/database";
const paths = getFilesSource(folder, "json");
const outputfile = path.join(folder,"data.zip");

const inputSources = paths.map((path) => ({
  readStream: fs.createReadStream(path),
  name: path.split("/").pop(), // getFile name
}));
const outputStream = fs.createWriteStream(outputfile);

const archive = archiver("zip", {
  zlib: { level: 9 },
});
archive.pipe(outputStream);
inputSources.forEach((src) =>
  archive.append(src.readStream, { name: src.name })
);
archive.finalize();