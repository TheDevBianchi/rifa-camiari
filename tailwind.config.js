// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        primary: {
          50: "#F2EBFF",
          100: "#E6D7FF",
          200: "#D5BFFF",
          300: "#C4A7FF",
          400: "#A98AFF",
          500: "#8c52ff", // Tu color base
          600: "#7F3DFF",
          700: "#6826D9",
          800: "#511EAD",
          900: "#3D1782",
          950: "#2A0F5B",
        },
        secondary: {
          50: "#FFEBEC",
          100: "#FFD7D7",
          200: "#FFBFBF",
          300: "#FFA7A7",
          400: "#FF8A8A",
          500: "#ff5757", // Tu color base
          600: "#E64E4E",
          700: "#BF3F3F",
          800: "#993232",
          900: "#732626",
          950: "#4D1A1A",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dark: {
          background: "#0A0B14",
          foreground: "#F8FAFC",
          card: "#151823",
          cardHover: "#1E2235",
          border: "#2D3348",
          input: "#151823",
          ring: "#6366F1",
        },
        success: {
          light: "#22C55E",
          dark: "#16A34A",
        },
        warning: {
          light: "#FBBF24",
          dark: "#F59E0B",
        },
        error: {
          light: "#F43F5E",
          dark: "#E11D48",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float-1": {
          "0%, 100%": {
            transform: "translateY(0)",
            opacity: "0.7",
          },
          "50%": {
            transform: "translateY(-20px)",
            opacity: "0.9",
          },
        },
        "float-2": {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateY(-15px) translateX(10px)",
            opacity: "0.8",
          },
        },
        "float-3": {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
            opacity: "0.7",
          },
          "50%": {
            transform: "translateY(-10px) translateX(-10px)",
            opacity: "0.9",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.3",
          },
          "50%": {
            opacity: "0.5",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-1": "float-1 5s ease-in-out infinite",
        "float-2": "float-2 7s ease-in-out infinite",
        "float-3": "float-3 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
      },
      backgroundImage: {
        "footer-gradient":
          "linear-gradient(135deg, #000000 2%, #490505 63%, #06145D 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
