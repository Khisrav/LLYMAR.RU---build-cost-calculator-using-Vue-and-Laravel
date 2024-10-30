import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        include: ["pdfmake/build/pdfmake", "pdfmake/build/vfs_fonts"],
    },
    build: {
        sourcemap: true, // Optional: enables sourcemaps for debugging
    },
});
