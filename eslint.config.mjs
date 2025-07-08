import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: { ecmaVersion: "latest" },
  },
  tseslint.configs.recommended,



]);
