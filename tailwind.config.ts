import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sky: "#38bdf8",
          purple: "#a855f7",
          yellow: "#facc15",
          mint: "#34d399",
          orange: "#fb923c",
          coral: "#f43f5e",
          indigo: "#6366f1",
          amber: "#f59e0b",
        },
        kid: {
          blue: "#0ea5e9",
          pink: "#ec4899",
          green: "#10b981",
          yellow: "#eab308",
          purple: "#8b5cf6",
          orange: "#f97316",
        }
      },
      fontFamily: {
        child: ['"Comic Sans MS"', '"Chalkboard SE"', '"Comic Neue"', 'sans-serif'],
        friendly: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'kid': '0 8px 0px 0px rgba(0, 0, 0, 0.08), 0 15px 25px -5px rgba(0, 0, 0, 0.1)',
        'kid-pressed': '0 2px 0px 0px rgba(0, 0, 0, 0.08), 0 5px 10px -2px rgba(0, 0, 0, 0.1)',
        'glow-yellow': '0 0 25px rgba(250, 204, 21, 0.5)',
        'glow-blue': '0 0 25px rgba(56, 189, 248, 0.5)',
        'glow-purple': '0 0 25px rgba(168, 85, 247, 0.5)',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(-4%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

