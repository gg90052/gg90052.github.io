import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import htmlTemplate from "vite-plugin-html-template";
import EnvironmentPlugin from "vite-plugin-environment";
import AutoImport from "unplugin-auto-import/vite";
import VitePluginHtmlEnv from 'vite-plugin-html-env'


export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      store: "/src/store",
    },
  },
  server: {
    https: true,
  },
  plugins: [
    vue(),
    htmlTemplate(),
    EnvironmentPlugin("all", { prefix: "VUE_APP_" }),
    VitePluginHtmlEnv({
      envPrefixes: 'VUE_APP_'
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      eslintrc: {
        enabled: true,
      },
      dts: "./src/types/auto-imports.d.ts",
    }),
  ],
});
