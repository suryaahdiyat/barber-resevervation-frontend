import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), autoprefixer()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
