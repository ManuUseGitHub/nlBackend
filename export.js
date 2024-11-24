const fs = require("fs");
const { getFilesSource } = require("./file-utils");
const { HEADERS } = require("./ressources/constents");
const path = require("path");

const folder = "assets/database";
const destination = "ressources/exports";
const paths = getFilesSource(folder, "json");

let saveCount = 0;
let expectedCount = 0;

const writeCSV = (rows, fileName) => {
  let csv = `${rows
    .map((x) => {
      let x2 = [];
      Object.values(x).forEach((value) => {
        let normalized = value ? `${value}` : "";

        x2.push(/,|;/g.test(normalized) ? `"${normalized}"` : normalized);
      });
      x2 = x2.join(";");
      return x2;
    })
    .join(";\n")};`;
  fs.writeFile(fileName, csv, "utf8", function (err) {
    if (err) {
      console.log(
        "Some error occured - file either not saved or corrupted file saved."
      );
    } else {
      if (++saveCount == expectedCount) console.log("It's saved!");
    }
  });
};

const exportPartsIntoSeparateFiles = ({ key, entries }) => {
  let rows = [];
  rows.push(HEADERS);

  entries.forEach(
    ({
      dutch,
      french,
      type,
      id,
      article,
      part,
      chapter,
      tags,
      issuer,
      date,
      difficulty,
    }) => {
      rows.push([
        dutch,
        french,
        type,
        id,
        article,
        part,
        chapter,
        tags,
        issuer,
        date,
        difficulty,
      ]);
    }
  );
  writeCSV(
    rows,
    path.join(destination, path.basename(key, path.extname(key)) + ".csv")
  );
};

paths.forEach((fileName) => {
  const data = JSON.parse(fs.readFileSync(fileName));
  Object.entries(data).map(([key, entries]) => {
    exportPartsIntoSeparateFiles({ key, entries });
    expectedCount++;
  });
});
