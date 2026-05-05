const themeColors = {
  primary: '#E2B042',
  secondary: '#C59837',
  accent: '#F4C978',
  background: '#0A0A09',
  surface: '#141412',
  muted: '#666664',
  border: 'rgba(255, 255, 255, 0.12)',
  navbar: '#141412',
  glass: 'rgba(20, 20, 18, 0.8)',
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        accent: themeColors.accent,
        background: themeColors.background,
        surface: themeColors.surface,
        muted: themeColors.muted,
        border: themeColors.border,
        navbar: themeColors.navbar,
        glass: themeColors.glass,
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        h1: ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
        h2: ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        h3: ["1.25rem", { lineHeight: "1.75rem" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        small: ["0.875rem", { lineHeight: "1.25rem" }],
        tiny: ["0.75rem", { lineHeight: "1rem" }],
      },
      fontFamily: {
        // ElevenLabs Scalable Tokens
        sans: ["Inter-Regular"],
        "sans-medium": ["Inter-Medium"],
        "sans-semibold": ["Inter-SemiBold"],
        "sans-bold": ["Inter-Bold"],
        serif: ["CormorantGaramond-Regular"],
        "serif-light": ["CormorantGaramond-Light"],
        "serif-medium": ["CormorantGaramond-Medium"],
        "serif-bold": ["CormorantGaramond-Bold"],
        // Legacy Support
        outfit: ["Outfit-Regular"],
        jakarta: ["PlusJakartaSans-Regular"],
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
    },
  },
  plugins: [],
}