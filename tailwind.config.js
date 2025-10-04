import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: [
    './resources/views/**/*.blade.php',
    './vendor/laravel/jetstream/**/*.blade.php',
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './resources/js/**/*.js',
    './resources/js/**/*.jsx',
    './resources/js/**/*.ts',
    './resources/js/**/*.tsx',
        './resources/components/ui/**/*.jsx',  // <- include all UI components
        './resources/components/layouts/**/*.jsx',  // <- include all layout components
        './resources/js/Pages/**/*.jsx',  // <- include all page components
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [forms, typography],
  safelist: [
    // add any dynamic classes you use
    'bg-blue-500', 'bg-red-500', 'bg-green-500',
    'text-white', 'text-black',
    'rounded', 'shadow-lg', 'p-4',
  ],
};
