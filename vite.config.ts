import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import vue from "@vitejs/plugin-vue";
import ViteYaml from "@modyfi/vite-plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS(), ViteYaml()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": {
        secure: false,
        changeOrigin: true,
        target: "https://supernode.maa-org.net/",
      },
    },
  },
});
