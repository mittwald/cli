import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: [
      "**/*.js",
      "**/*.test.ts",
      "**/dist/**/*",
      "**/dist-cjs/**/*",
      "**/build/",
      "**/.yarn/",
      "**/node_modules/",
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs["flat/recommended"],
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "linebreak-style": ["error", "unix"],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],

      semi: ["error", "always"],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "([iI]gnored|_)",
          argsIgnorePattern: "([iI]gnored|_)",
          caughtErrorsIgnorePattern: "[iI]gnored",
        },
      ],

      curly: ["error", "all"],
      camelcase: [
        "error",
        { properties: "always", ignoreImports: true, ignoreGlobals: true },
      ],
    },
  },
];
