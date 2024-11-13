import jsEslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tsEslint from "typescript-eslint";

export default tsEslint.config(
  jsEslint.configs.recommended,
  ...tsEslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  eslintConfigPrettier,
  {
    ignores: ["**/dist/", "**/public/", "**/docs/", "**/node_modules/"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: true,
        process: true,
      },
    },
    rules: {
      "import/no-unresolved": "off",
      "import/newline-after-import": [
        "error",
        { considerComments: true, count: 1 },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/no-duplicates": ["error", { considerQueryString: true }],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            "object",
            "type",
            ["builtin", "external", "internal"],
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "*.+(scss|css|less)",
              patternOptions: { matchBase: true },
              group: "object",
            },
            { pattern: "~/**", group: "internal", position: "after" },
            { pattern: "../**", group: "parent", position: "before" },
          ],
          pathGroupsExcludedImportTypes: [
            "builtin",
            "external",
            "object",
            "type",
          ],
          distinctGroup: false,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
    },
    languageOptions: {
      parser: tsEslint.parser,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  }
);
