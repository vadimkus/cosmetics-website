// Basic ESLint config for Next.js without circular dependency issues
module.exports = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**", 
      "dist/**",
      "next-env.d.ts",
      "lib/generated/**",
      "public/sw.js",
      "scripts/**",
      "*.config.js",
      "*.config.mjs", 
      "jest.config.js",
      "jest.setup.js",
      "coverage/**",
      "backups/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "react": require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      "@next/next": require("@next/eslint-plugin-next"),
    },
    rules: {
      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // TypeScript
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_" 
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // General
      "no-console": "warn",
      "prefer-const": "error",
      
      // Next.js
      // no-img-element downgraded to warn: 14 legacy <img> usages are
      // performance advice, not bugs. Converting them to next/image risks
      // layout regressions — backlogged for deliberate, per-page migration.
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/__tests__/**/*", "**/*.{test,spec}.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
];