/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        porcelain: {
          50: '#FFFFFF',
          100: '#FAFAFC',
          200: '#F4F5F8',
          300: '#EAECEF',
          400: '#D5D8DF',
          500: '#B0B5C1'
        },
        onyx: {
          950: '#0A0A12',
          900: '#12121A',
          800: '#1E1E2D',
          700: '#2E2F42',
          600: '#4A4C68',
          500: '#6E7191'
        },
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065'
        },
        emerald: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        'serif-luxury': ['"Cinzel Decorative"', 'Cinzel', 'serif'],
        sans: ['Outfit', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'luxury-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 2px 10px -2px rgba(109, 40, 217, 0.12)',
        'luxury-card': '0 18px 45px -10px rgba(0, 0, 0, 0.08), 0 4px 15px -2px rgba(6, 78, 59, 0.18)',
        'purple-glow': '0 0 30px rgba(124, 58, 237, 0.35)',
        'emerald-glow': '0 0 30px rgba(16, 185, 129, 0.35)',
        'regal-strong': '0 14px 40px rgba(76, 29, 149, 0.28), 0 4px 12px rgba(6, 78, 59, 0.15)'
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'pulse-purple': 'pulsePurple 4s infinite ease-in-out',
        'pulse-emerald': 'pulseEmerald 4s infinite ease-in-out',
        'aura': 'pulseAura 6s infinite ease-in-out',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        pulsePurple: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        pulseEmerald: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        pulseAura: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.15)', opacity: '0.75' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
