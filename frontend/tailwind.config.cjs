/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1', // Indigo 500
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#a855f7', // Purple 500
                    foreground: '#ffffff',
                },
                background: '#0f172a', // Slate 900
                foreground: '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
