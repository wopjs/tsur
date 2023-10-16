import { defineConfig } from "tsup";

import mangleCache from "./mangle-cache.json";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "patches/index": "src/patches/array.ts",
    "patches/array": "src/patches/array.ts",
  },
  format: ["cjs", "esm"],
  target: "esnext",
  clean: true,
  treeshake: true,
  dts: true,
  splitting: false,
  sourcemap: true,
  minify: Boolean(process.env.MINIFY),
  esbuildOptions: options => {
    options.mangleProps = /[^_]_$/;
    options.mangleCache = mangleCache;
  },
});
