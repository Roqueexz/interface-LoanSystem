/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
extend: {
  colors: {
    background: "var(--background)",
    foreground: "var(--foreground)",

    card: "var(--card)",
    "card-foreground": "var(--card-foreground)",

    muted: "var(--muted)",
    "muted-foreground": "var(--muted-foreground)",

    accent: "var(--accent)",
    "accent-foreground": "var(--accent-foreground)",

    border: "var(--border)",

    ring: "var(--ring)",

    primary: "var(--primary)",
    "primary-foreground": "var(--primary-foreground)",

    destructive: "var(--destructive)",
    "destructive-foreground": "var(--destructive-foreground)",

    popover: "var(--popover)",
    "popover-foreground": "var(--popover-foreground)",
  }
},
  plugins: [],
}