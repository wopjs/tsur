/** @type {import("eslint").Linter.Config */
const config = {
  root: true,
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
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
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": false,
        },
        extendDefaults: true,
      },
    ],
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
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
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
          {
            pattern: "~/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "../**",
            group: "parent",
            position: "before",
          },
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
};

// eslint-disable-next-line no-undef
module.exports = config;
