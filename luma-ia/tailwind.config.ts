// Ruta: tailwind.config.ts

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            // Paleta accesible (WCAG AA ratio > 4.5:1)
            primary: {
            DEFAULT: '#004aad', // Azul profundo
            hover: '#003a8c',
            content: '#ffffff'
            },
            sos: {
            DEFAULT: '#d32f2f', // Rojo de alta visibilidad para emergencias
            hover: '#b71c1c',
            content: '#ffffff'
            },
            background: '#f8fafc', // slate-50
            text: '#0f172a', // slate-900 (alto contraste sobre fondo claro)
        },
        minHeight: {
            'touch': '48px', // Touch target mínimo de 48x48px
        },
        minWidth: {
            'touch': '48px', 
        }
        },
    },
    plugins: [],
}