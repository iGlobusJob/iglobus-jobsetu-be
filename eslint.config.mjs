import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
    },
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }],
            "no-console": "off",
            "@typescript-eslint/no-non-null-assertion": "warn",
        },
    },
    {
        ignores: [
            "node_modules/",
            "dist/",
            "coverage/",
            "*.config.js",
            "*.config.ts",
            ".git/"
        ],
    },
];
