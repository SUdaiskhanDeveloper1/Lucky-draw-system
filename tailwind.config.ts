import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /** Full brand ramp for gradients, tints and illustrative accents. */
        brand: {
          50: "hsl(152 62% 96%)",
          100: "hsl(152 58% 91%)",
          200: "hsl(152 52% 81%)",
          300: "hsl(152 48% 66%)",
          400: "hsl(152 52% 50%)",
          500: "hsl(153 62% 38%)",
          600: "hsl(153 71% 28%)",
          700: "hsl(154 72% 23%)",
          800: "hsl(155 68% 18%)",
          900: "hsl(156 62% 14%)",
          950: "hsl(158 70% 8%)",
        },
      },
      borderRadius: {
        "3xl": "calc(var(--radius) + 12px)",
        "2xl": "calc(var(--radius) + 6px)",
        xl: "calc(var(--radius) + 2px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 7px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 hsl(var(--shadow-color) / 0.05)",
        soft: "0 1px 2px 0 hsl(var(--shadow-color) / 0.04), 0 4px 14px -4px hsl(var(--shadow-color) / 0.07)",
        card: "0 1px 3px 0 hsl(var(--shadow-color) / 0.05), 0 10px 28px -12px hsl(var(--shadow-color) / 0.12)",
        lift: "0 2px 6px -1px hsl(var(--shadow-color) / 0.07), 0 18px 40px -12px hsl(var(--shadow-color) / 0.18)",
        pop: "0 24px 64px -18px hsl(var(--shadow-color) / 0.28)",
        glow: "0 10px 30px -10px hsl(var(--primary) / 0.5)",
        "inner-top": "inset 0 1px 0 0 hsl(0 0% 100% / 0.08)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(153 62% 38%) 55%, hsl(152 52% 50%) 100%)",
        "brand-sheen":
          "linear-gradient(120deg, transparent 20%, hsl(0 0% 100% / 0.18) 50%, transparent 80%)",
        "mesh-light":
          "radial-gradient(60rem 30rem at 12% -10%, hsl(152 62% 90% / 0.9), transparent 60%), radial-gradient(45rem 28rem at 96% 0%, hsl(42 92% 88% / 0.55), transparent 55%)",
        "mesh-dark":
          "radial-gradient(60rem 30rem at 12% -10%, hsl(155 68% 18% / 0.55), transparent 60%), radial-gradient(45rem 28rem at 96% 0%, hsl(42 60% 22% / 0.28), transparent 55%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.35)" },
          "70%": { boxShadow: "0 0 0 12px hsl(var(--primary) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0)" },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height, auto)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16,1,0.3,1)",
        "fade-in-up": "fade-in-up 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.22s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-left": "slide-in-left 0.35s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.66,0,0,1) infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
