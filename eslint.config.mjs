import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // The DB-access layer maps dynamically-typed Postgres rows (the neon driver
  // returns Record<string, any>), so `any` row casts are intrinsic there.
  {
    files: ["src/lib/db.ts", "src/lib/items.ts", "src/lib/sync.ts", "src/lib/collections.ts",
      "src/lib/state.ts", "src/lib/tags.ts", "src/lib/dashboard.ts", "src/lib/syncLog.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
]);

export default eslintConfig;
