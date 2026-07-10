import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  define: {
    // react-rnd의 의존성 react-draggable이 process.env.DRAGGABLE_DEBUG를 참조하는데,
    // 브라우저엔 process가 없어 ReferenceError로 앱 창이 크래시함 → 빈 객체로 치환
    "process.env": {},
  },
  optimizeDeps: {
    // lazy 청크(VSCode 앱)에서만 쓰여 dev가 런타임에 발견 → 사전번들 리로드로 페이지가 새로고침됨
    include: ["monaco-editor", "yjs", "y-monaco", "y-protocols/awareness"],
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
          react: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],
          net: ["colyseus.js", "peerjs", "appwrite"],
        },
      },
    },
  },
});
