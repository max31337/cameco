import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Use Ziggy's route helper if available, otherwise create a fallback
if (!window.route) {
    console.warn('Ziggy route helper not found, using fallback route helper');
    window.route = (name, params) => {
        const routes = {
            'login': '/login',
            'register': '/register',
            'dashboard': '/dashboard',
            'logout': '/logout',
            'profile.show': '/user/profile',
            'admin.profile.complete': '/admin/profile/complete',
            'admin.profile.store': '/admin/profile/store',
            'admin.profile.skip': '/admin/profile/skip',
            'admin.profile.save-progress': '/admin/profile/save-progress',
            'admin.employees': '/admin/employees',
            'admin.timekeeping': '/admin/timekeeping',
            'admin.payroll': '/admin/payroll',
            'admin.reports': '/admin/reports'
        };
        const route = routes[name];
        if (!route) {
            console.error(`Route "${name}" not found in fallback route helper`);
            return '/';
        }
        return route;
    };
}

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
