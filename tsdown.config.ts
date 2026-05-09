import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    patches: "src/patches/index.ts",
  },
  format: ["cjs", "esm"],
  minify: Boolean(process.env.MINIFY),
  sourcemap: false,
  target: "esnext",
  treeshake: false,
  external: ["@wopjs/tsur"],
});
