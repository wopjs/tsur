import fs from "node:fs";
import path from "node:path";

const {
  private: _,
  scripts: __,
  ...pkg
} = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "..", "package.json"))
);

const dist = path.join(import.meta.dirname, "..", "dist");

fs.writeFileSync(path.join(dist, "package.json"), JSON.stringify(pkg, null, 2));

const copy = filename => {
  fs.writeFileSync(
    path.join(dist, filename),
    fs.readFileSync(path.join(import.meta.dirname, "..", filename))
  );
};

copy("LICENSE");
copy("README.md");
