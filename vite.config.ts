import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/pf2-stats-web-app/',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
