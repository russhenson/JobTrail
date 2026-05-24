/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.tsx', './components/**/*.{js,jsx,ts,tsx}', './src/**/*.{html,js,jsx,ts,tsx,mdx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                brand: {
                    light: '#f6fff8',
                    default: '#56ab91',
                    dark: '#036666',
                    text: '#2c3e3b',
                    subtext: '#545e5c',
                },
                primary: {
                    DEFAULT: '#38706b',
                    dark: '#112a27',
                },
                secondary: {
                    DEFAULT: '#82b2ab',
                },
                accent: {
                    gold: '#df9d39',
                    'gold-light': '#ebd197',
                },
                neutral: {
                    bg: '#edf7f5',
                    card: '#ffffff',
                    text: '#2c3e3b',
                },
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
                '6xl': '3rem',
                '7xl': '3.5rem',
            },
        },
    },
    plugins: [],
};
