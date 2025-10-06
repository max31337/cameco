import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create a simple route helper for now
window.route = (name, params) => {
    const routes = {
        'login': '/login',
        'register': '/register',
        'dashboard': '/dashboard',
        'logout': '/logout',
        'profile.show': '/user/profile',
        'admin.profile.complete': '/admin/profile/complete'
    };
    return routes[name] || '/';
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Resolving page:', name);
        return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
    },
    setup({ el, App, props }) {
        console.log('Setting up app:', { el, App, props });
        if (!el) {
            console.error('No element found for mounting React app');
            return;
        }
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
}).then(() => {
    console.log('Inertia app initialized successfully');
}).catch((error) => {
    console.error('Error initializing Inertia app:', error);
});
