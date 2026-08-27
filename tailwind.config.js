/** @type {import('tailwindcss').Config} */
// Tokens seeded from real values pulled from the Figma file (Snehalayaa homepage) —
// not guessed. Extended as more sections are implemented; sizes not yet confirmed by a
// real Figma node use a conservative interpolation off the confirmed 14/15px base.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px", // narrow-phone breakpoint — lets a couple of components fit 2-up before Tailwind's default sm (640px)
      },
      colors: {
        primary: { DEFAULT: "#67111a" }, // maroon — unified with burgundy per brand (was purple #6f1e60)
        accent: { DEFAULT: "#b89552" }, // active nav / INR pill border — header, node 0:9, 0:48
        burgundy: { DEFAULT: "#67111a" }, // legal-pages hero overlay + headings — T&C page, node 2505:2277
        cream: "#faf7f2", // page/header background — header, node 0:6
        border: {
          DEFAULT: "#e8e0d5",
          strong: "#d0c8c0", // search bar border
          subtle: "#f1ebe3", // nav row divider
        },
        ink: {
          DEFAULT: "#171717", // nav item text
          secondary: "#555555", // "Color Search" label
          subtle: "#666666", // find-saree subheading/meta text — find-saree, node 0:856, 0:903
          muted: "#888888", // "Image Search" label
          faint: "#aaaaaa", // search placeholder
        },
        overlay: "rgba(0,0,0,0.64)", // hero image scrim — hero, node 0:74
        sand: "#f0ddcb", // caption text on dark photo cards — occasions, node 0:203, 0:210
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"], // hero heading — node 0:81
      },
      fontSize: {
        "2xs": "11px", // hero button labels — node 0:78, 0:80
        xs: "12px",
        sm: "13px",
        base: "14px", // confirmed — nav items, header, node 0:50 etc.
        md: "15px", // confirmed — search placeholder, header, node 0:17
        lg: "16px",
        xl: "18px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "28px",
        "5xl": "32px",
        "6xl": "72px", // hero heading — node 0:81
        "7xl": "38px", // large occasion-card heading — occasions, node 0:202
        "8xl": "45px", // section heading (Cormorant) — occasions, node 0:192
        tiny: "8px", // "Selected" badge label / product-card "New" badge — find-saree, node 0:901; new-arrivals, node 0:297
        title: "30px", // selected-summary title ("Kanjivaram · Red") — find-saree, node 0:902
        "heading-xl": "50px", // "Find Your Saree" heading — find-saree, node 0:855
        "heading-lg": "55px", // section heading ("New Arrivals", "Have a saree in mind?") — new-arrivals, node 0:276
        "heading-md": "40px", // brand ambassador heading — ambassador, node 0:847
        "heading-sm": "30px", // confirmed mobile size for every section heading — mobile frame, nodes 0:3215/3269/3407/3482/3499/3574/3671/3879 etc.
        label: "9px", // product-card fabric/weave micro-label — new-arrivals, node 0:299
        "card-title": "17px", // product-card title (Cormorant) — new-arrivals, node 0:300
      },
      borderRadius: {
        sm: "5px", // INR pill — header, node 0:9
        md: "6px", // search bar / color-search pill — header, node 0:13, 0:24
        lg: "12px",
        swatch: "8px", // colour swatch corner — find-saree, node 0:876
        card: "9px", // product-card image corner — new-arrivals, node 0:289
        full: "999px",
      },
      spacing: {
        18: "4.5rem",
      },
      letterSpacing: {
        wide2: "1px", // hero button labels — node 0:78, 0:80
      },
      // Maharani photo columns (node 2191:606) drift in opposite directions. One cell is
      // 213px tall + 15px gap, so a set of three advances exactly 684px — translating by
      // that much lands cell 4 where cell 1 started, which is why the loop has no seam.
      keyframes: {
        "column-up": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-684px)" },
        },
        "column-down": {
          from: { transform: "translateY(-684px)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "column-up": "column-up 40s linear infinite",
        "column-down": "column-down 40s linear infinite",
      },
    },
  },
  plugins: [],
};
