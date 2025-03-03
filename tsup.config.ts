import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    patches: "src/patches/index.ts",
  },
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: false,
  clean: true,
  treeshake: true,
  dts: true,
  minify: false,
  external: ["@wopjs/tsur"],
});
