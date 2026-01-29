import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#03040b',
                foreground: '#ffffff',
                'brand-primary': '#0070f3',
                'brand-secondary': '#7928ca',
                'brand-bg': '#03040b',
                'brand-text-dim': '#888888',
                'brand-border': 'rgba(255, 255, 255, 0.08)',
                primary: '#0070f3',
                secondary: '#7928ca',
                border: 'rgba(255, 255, 255, 0.08)',
                input: '#03040b',
                ring: '#0070f3',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}

export default config
