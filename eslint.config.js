import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import typescript from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules/"],
    plugins: {
      prettier,
      react,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": typescript,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
      quotes: ["off"],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
      "jsx-a11y/anchor-is-valid": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
