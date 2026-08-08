import { defineConfig, globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([".next/**", "dist/**", "out/**", "build/**", "next-env.d.ts", "worker-configuration.d.ts"]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.serviceworker } },
    settings: { react: { version: "detect" } },
  },
]);
