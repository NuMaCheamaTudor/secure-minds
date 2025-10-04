import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Mapăm culorile la variabilele CSS din globals.css (tema modernă)
        // Notă: folosim atât --bg/--fg, cât și denumirile shadcn (--background/--foreground) pentru compatibilitate.
        background: "hsl(var(--bg) / <alpha-value>)",
        foreground: "hsl(var(--fg) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input, var(--border)) / <alpha-value>)",
        ring: "hsl(var(--ring, var(--primary)) / <alpha-value>)",

        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground, var(--primary-fg)) / <alpha-value>)",
          soft: "hsl(var(--primary-soft, var(--primary) / .10))",
          hover: "hsl(var(--primary-hover, var(--primary)) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground, var(--secondary-fg)) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground, 0 0% 100%) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning, 38 92% 50%) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground, 0 0% 100%) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground, var(--fg)) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, var(--secondary)) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground, var(--secondary-foreground)) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover, var(--card)) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground, var(--fg)) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground, var(--fg)) / <alpha-value>)",
        },

        // Opțional: set complet pentru sidebar (compat cu codul tău existent)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, var(--card)) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground, var(--fg)) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary, var(--primary)) / <alpha-value>)",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground, var(--primary-foreground)) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent, var(--secondary)) / <alpha-value>)",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground, var(--secondary-foreground)) / <alpha-value>)",
          border: "hsl(var(--sidebar-border, var(--border)) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring, var(--ring)) / <alpha-value>)",
        },
      },

      // Radius global (compat cu shadcn)
      borderRadius: {
        lg: "var(--radius, 0.75rem)",
        md: "calc(var(--radius, 0.75rem) - 2px)",
        sm: "calc(var(--radius, 0.75rem) - 4px)",
        "2xl": "1rem",
      },

      // Umbre „soft” pentru carduri moderne
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
      },

      // Keyframes: originale + moderne (shimmer, float) pentru efecte shiny/mesh/blobs
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(6px, -12px)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-scale": "fade-in-scale 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        shimmer: "shimmer 1.8s linear infinite",
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
