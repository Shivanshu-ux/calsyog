/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505', // Rich Black
                foreground: '#F5F5F5', // Off-white
                primary: {
                    DEFAULT: '#D4AF37', // Gold
                    foreground: '#000000',
                },
                secondary: {
                    DEFAULT: '#C5A059', // Muted Gold
                    foreground: '#000000',
                },
                accent: {
                    DEFAULT: '#B49030', // Darker Gold
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#262626',
                    foreground: '#A3A3A3',
                },
                card: {
                    DEFAULT: '#0A0A0A',
                    foreground: '#F5F5F5',
                },
                border: '#262626',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
