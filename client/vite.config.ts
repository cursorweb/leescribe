import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../server/dist",
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks: id => {
                    if (id.includes("node_modules")) {
                        if (id.includes("opencc-js")) {
                            return "vendor_opencc";
                        } else if (id.includes("pinyin-pro")) {
                            return "vendor_pinyin-pro";
                        }

                        return "vendor"; // all other package goes here
                    }
                }
            }
        }
    }
});
