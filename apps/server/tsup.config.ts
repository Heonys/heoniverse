import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  outDir: "dist",
  clean: true,
  sourcemap: true,
  // 워크스페이스 TS 소스는 인라인하고, bcrypt/uWS 같은 네이티브 모듈은 external로 유지한다
  noExternal: [/@heoniverse\/shared/],
});
