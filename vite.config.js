import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        // Ensure React plugin runs first so it can detect and transform JSX.
        // Make the include explicit so dynamic imports (import.meta.glob) are transformed.
        react({
            jsxRuntime: 'automatic',
            include: ['resources/js/**/*.{js,jsx,ts,tsx}']
        }),
        laravel({
            input: ['resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx', // optional if using SSR
            refresh: true,
        }),
    ],
});
