import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Yabatech colors
        primary: "#006837", // Yabatech deep green
        "primary-light": "#39B54A", // Yabatech light green
        accent: "#FFC20E", // Yabatech gold

        // Supporting colors
        "dark-neutral": "#2D3748",
        "light-bg": "#F7FAFC",
        error: "#E53E3E",
        success: "#38A169",
        "neutral-gray": "#718096",
        "light-gray": "#EDF2F7",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scan: {
          "0%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "pulse-border": {
          "0%, 100%": { borderColor: "rgba(0, 104, 55, 0.3)" },
          "50%": { borderColor: "rgba(0, 104, 55, 0.8)" },
        },
        "scan-reverse": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        zoomIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "80%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-10deg) scale(0.8)", opacity: "0" },
          "100%": { transform: "rotate(0) scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scan: "scan 2s ease-in-out infinite",
        "pulse-border": "pulse-border 2s ease-in-out infinite",
        "scan-reverse": "scan-reverse 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "slide-down": "slideDown 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-slow": "fadeIn 1.2s ease-out forwards",
        "zoom-in": "zoomIn 0.8s ease-out forwards",
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 8s linear infinite",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "rotate-in": "rotateIn 0.8s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

