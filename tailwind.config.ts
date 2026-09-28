import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF9',
        ink: { DEFAULT: '#12131A', soft: '#383B47' },
        surface: { DEFAULT: '#FFFFFF', muted: '#F2F1ED' },
        steel: { DEFAULT: '#0C0D11', raised: '#16171F' },
        brand: { DEFAULT: '#FF5A1F', amber: '#FFB020', deep: '#E0341A' },
        utility: { DEFAULT: '#17B899', light: '#E6F9F5', dark: '#0E7A64' },
        muted: '#7A7E8C',
        line: { DEFAULT: 'rgba(18,19,26,0.09)', dark: 'rgba(255,255,255,0.12)' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'sans-serif'],
        body: ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: { shell: '1160px' },
      borderRadius: { card: '24px', panel: '16px', control: '10px' },
      boxShadow: {
        card: '0 1px 2px rgba(18,19,26,0.04), 0 16px 32px -20px rgba(18,19,26,0.16)',
        'card-hover': '0 1px 2px rgba(18,19,26,0.05), 0 24px 48px -20px rgba(18,19,26,0.22)',
        brand: '0 12px 28px -10px rgba(255,90,31,0.5)',
        'brand-hover': '0 16px 34px -8px rgba(255,90,31,0.6)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF5A1F, #FFB020)',
        'hero-radial':
          'radial-gradient(120% 100% at 15% 0%, #1B1D26 0%, #0C0D11 55%, #16171F 100%)',
        'cta-radial': 'radial-gradient(120% 140% at 85% 0%, #1B1D26 0%, #0C0D11 60%)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '24px' },
        },
        'mic-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(224,52,26,0.45)' },
          '50%': { boxShadow: '0 0 0 20px rgba(224,52,26,0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.2s ease-out infinite',
        wave: 'wave 1.1s ease-in-out infinite',
        'mic-pulse': 'mic-pulse 1.4s ease-in-out infinite',
        'fade-in': 'fade-in 0.22s ease',
      },
    },
  },
  plugins: [],
};

export default config;
