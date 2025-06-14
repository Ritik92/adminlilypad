/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./components/ui/**/*.{js,ts,jsx,tsx}", // shadcn components
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode Colors globally
        light: {
          surfacePrimary: "var(--surface-primary)",
          surfaceSecondary: "var(--surface-container-secondary)",
          surfaceTertiary: "var(--surface-container-tertiary)",
          surfaceQuaternary: "var(--surface-container-quaternary)",

          onSurfacePrimary: "var(--on-surface-element-primary)",
          onSurfaceSecondary: "var(--on-surface-element-secondary)",
          onSurfaceTertiary: "var(--on-surface-element-tertiary)",
          onSurfaceQuaternary: "var(--on-surface-element-quaternary)",

          outline: "var(--outline)",
          shadow: "var(--shadow)",

          highlight: "var(--highlight)",
          highlight2: "var(--highlight-2)",
        },

        // Dark Mode Colors
        dark: {
          surfacePrimary: "var(--surface-primary)",
          surfaceSecondary: "var(--surface-container-secondary)",
          surfaceTertiary: "var(--surface-container-tertiary)",
          surfaceQuaternary: "var(--surface-container-quaternary)",

          onSurfacePrimary: "var(--on-surface-element-primary)",
          onSurfaceSecondary: "var(--on-surface-element-secondary)",
          onSurfaceTertiary: "var(--on-surface-element-tertiary)",
          onSurfaceQuaternary: "var(--on-surface-element-quaternary)",

          outline: "var(--outline)",
          shadow: "var(--shadow)",

          highlight: "var(--highlight)",
          highlight2: "var(--highlight-2)",
        },

        button: {
          normal: {
            fill: "var(--button-normal-fill)",
            fill_2: "var(--button-normal-fill-2)",
            fillprimary: "var(--button-normal-fill-primary)",
            element: "var(--button-normal-element)",
            element_2: "var( --button-normal-element-2)",

            outline: "var(--button-normal-outline)",
          },
          hover: {
            fill: "var(--button-hover-fill)",
            fill_2: "var(--button-hover-fill-2)",
            element: "var(--button-hover-element)",
            element_2: "var(  --button-hover-element-2)",
            outline: "var(--button-hover-outline)",
          },
          active: {
            fill: "var(--button-active-fill)",
            fill_2: "var( --button-active-fill-2)",
            element_2: "var(  --button-active-element-2)",
            element: "var(--button-active-element)",
            outline: "var(--button-active-outline)",
          },
          disable: {
            fill: "var(--button-disable-fill)",
            element: "var(--button-disable-element)",
            outline: "var(--button-disable-outline)",
          },
        },

        nav: {
          surfaceContainerInside: "var(--surface-container-inside)",
          barSurface: "var(--nav-bar-surface)",
          outline: "var(--nav-outline)",
        },
        label: {
          normal: "var(--ost-label-normal)",
          hover: "var(--ost-label-hover)",
          active: "var(--ost-label-active)",
          disable: "var(--ost-label-disable)",
        },
        surface: {
          containerNormal: "var(--surface-container-normal)",
          containerActive: "var(--surface-container-active)",
        },
        oslLabel: {
          normal: "var(--osl-label-normal)",
        },

        // Common Colors
        white: "#FFFFFF",
        black: "#000000",
        mingray: "#EEEEF0",
        inputTextGray: "#484848",
        lightWhite: "#F6F6F6",

        darkGray: "#1A1A1A",
        textSmallGray: "#444444",
        grayMedium: "#9CA3AF",
        grayDark: "#696969",
        grayDarker: "#454545",
        grayLight: "#D9D9D9",
        grayLighter: "#E5E7EB",
        graySoft: "#F5F5F5",
        grayCustom: "#E4E6E9",

        lightCyan: "#B0FFFF",
        cyan: "#00FFFF",
        lightTextGray: "#9CA3AF",
        grayLightMode: "#F6F6F7",

        grayNeutral: "#444444",
        grayDeep: "#272728",
        grayText: "#4B5563",
      },

      boxShadow: {
        "inset-custom": "inset 0px 0px 4px 0px #00000066",
        "custom-default": "0px 0px 0px 0px rgba(27, 28, 29, 1)",
        "custom-hover": "0px 4px 24px 2px rgba(0, 107, 107, 0.3);",
      },

      fontSize: {
        h1: ["60px", { lineHeight: "1.2" }], // Desktop
        "h1-m": ["48px", { lineHeight: "1.2" }], // Mobile

        h2: ["48px", { lineHeight: "1.3" }],
        "h2-m": ["40px", { lineHeight: "1.3" }],

        h3: ["40px", { lineHeight: "1.4" }],
        "h3-m": ["32px", { lineHeight: "1.4" }],

        h4: ["32px", { lineHeight: "1.5" }],
        "h4-m": ["24px", { lineHeight: "1.5" }],

        h5: ["24px", { lineHeight: "1.6" }],
        "h5-m": ["16px", { lineHeight: "1.6" }],

        h6: ["20px", { lineHeight: "1.7" }],
        "h6-m": ["14px", { lineHeight: "1.7" }],

        body: ["16px", { lineHeight: "1.8" }],
        "body-m": ["12px", { lineHeight: "1.8" }],

        c1: ["14px", { lineHeight: "1.9" }],
        "c1-m": ["12px", { lineHeight: "1.9" }],

        c2: ["12px", { lineHeight: "2" }],
        "c2-m": ["8px", { lineHeight: "2" }],

        tiny: ["10px", { lineHeight: "2.2" }],
        "tiny-m": ["10px", { lineHeight: "2.2" }],
      },

      fontWeight: {
        bold: "700",
        semibold: "600",
        medium: "500",
        regular: "400",
      },

      lineHeight: {
        lh0: "72px",
        lh1: "58px",
        lh2: "48px",
        lh3: "38px",
        lh4: "29px",
        lh5: "24px",
        lh6: "19px",
        lh7: "17px",
        lh8: "0px",
      },

      fontFamily: {
        raleway: ["Raleway", "Inter", "sans-serif"],
      },

      borderRadius: {
        xxs: "var(--radius-xxs)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        xxl: "var(--radius-xxl)",
        xxxl: "var(--radius-xxxl)",
        full: "var(--radius-full)",
      },

      spacing: {
        tiny: "var(--spacing-tiny)",
        xxs: "var(--spacing-xxs)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        xxl: "var(--spacing-xxl)",
        xxxl: "var(--spacing-xxxl)",
        giant: "var(--spacing-giant)",
        huge: "var(--spacing-huge)",
      },
      screens: {
        xs: { max: "321px" },
        xl: "1281px", // Default xl starts from 1280px, but now it starts from 1281px
      },

      strokeWidth: {
        s: "var(--stroke-s)",
        sm: "var(--stroke-sm)",
        ml: "var(--stroke-ml)",
        xl: "var(--stroke-xl)",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },

      animation: {
        "fade-in": "fade-in 0.7s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  darkMode: ["class"], // Enables dark mode with a "dark" class
  plugins: [],
};
