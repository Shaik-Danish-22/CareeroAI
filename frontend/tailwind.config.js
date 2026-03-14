/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color tokens for modern SaaS
        primary: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#c1daff',
          300: '#a2c7ff',
          400: '#7ba4ff',
          500: '#3B82F6', // Accent Blue
          600: '#2563EB', // Secondary Blue
          700: '#1e40af',
          800: '#1e3a8a', // Primary Blue
          900: '#172554',
        },
        // Semantic tokens for design consistency
        'brand-primary': '#1E3A8A',
        'brand-secondary': '#2563EB',
        'brand-accent': '#3B82F6',
        'bg-base': '#F8FAFC',
        'bg-card': '#FFFFFF',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'border-color': '#E2E8F0',
        
        // Extended color palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        rose: {
          50: '#fff5f7',
          100: '#ffe4e9',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },

      // Modern shadow utilities
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'none': 'none',
        // Subtle glass effect shadows
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
        // Hover elevation
        'hover': '0 12px 24px -5px rgba(0, 0, 0, 0.15)',
      },

      // Rounded corner variants
      borderRadius: {
        'sm': '6px',
        'base': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // Transition utilities
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-light': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      // Animation utilities for modern UI
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },

      // Backdrop blur for glassmorphism
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'base': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },

      // Spacing utilities
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-left))',
      },

      // Font utilities - Enhanced with hero sizes
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        '5xl': ['48px', { lineHeight: '56px', fontWeight: '800' }],
        '6xl': ['60px', { lineHeight: '72px', fontWeight: '800' }],
        '7xl': ['72px', { lineHeight: '84px', fontWeight: '800' }],
        '8xl': ['96px', { lineHeight: '98px', fontWeight: '900' }],
      },

      // Font weight utilities
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        '800': '800',
        '900': '900',
      },

      // Letter spacing for modern typography
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '0',
        'wide': '0.02em',
      },

      // Max width for containers
      maxWidth: {
        'xs': '20rem',
        'sm': '24rem',
        'md': '28rem',
        'lg': '32rem',
        'xl': '36rem',
        '2xl': '42rem',
        '3xl': '48rem',
        '4xl': '56rem',
        '5xl': '64rem',
        '6xl': '72rem',
        '7xl': '80rem',
        'container': '1280px',
      },
    },
  },

  plugins: [],
}