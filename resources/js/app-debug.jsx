import './bootstrap';
import '../css/app.css';

console.log('App.jsx loading...');

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
console.log('App name:', appName);

// Create a simple route helper for now
window.route = (name, params) => {
    const routes = {
        'login': '/login',
        'register': '/register',
        'dashboard': '/dashboard',
        'logout': '/logout',
        'profile.show': '/user/profile'
    };
    return routes[name] || '/';
};

console.log('Route helper created');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log('Resolving page:', name);
        try {
            const result = resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
            console.log('Page resolved:', result);
            return result;
        } catch (error) {
            console.error('Error resolving page:', error);
            throw error;
        }
    },
    setup({ el, App, props }) {
        console.log('Setting up app:', { el, App, props });
        
        if (!el) {
            console.error('No element found for mounting React app');
            return;
        }
        
        try {
            const root = createRoot(el);
            console.log('React root created');
            root.render(<App {...props} />);
            console.log('App rendered');
        } catch (error) {
            console.error('Error rendering app:', error);
        }
    },
    progress: {
        color: '#4B5563',
    },
}).then(() => {
    console.log('Inertia app initialized successfully');
}).catch((error) => {
    console.error('Error initializing Inertia app:', error);
});