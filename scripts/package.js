const fs = require("node:fs");
const path = require("node:path");
const pkg = require("../package.json");

delete pkg.private;
delete pkg.scripts;

const dist = path.join(__dirname, "..", "dist");

fs.writeFileSync(path.join(dist, "package.json"), JSON.stringify(pkg, null, 2));

const copy = filename => {
  fs.writeFileSync(
    path.join(dist, filename),
    fs.readFileSync(path.join(__dirname, "..", filename))
  );
};

copy("LICENSE");
copy("README.md");
