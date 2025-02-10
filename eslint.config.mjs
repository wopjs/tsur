import wopjs, { defineConfig } from "@wopjs/eslint-config";

export default defineConfig(...wopjs, {
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
});
