/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      colors:{
        lamaSky:"#C3EBFA",
        lamaSkyLight:"#EDF9FD",
        lamaPruple:"#CFCEFF",
        lamaPrupleLight:"#F1F0FF",
        lamaYellow:"#FAE27C",
        lamaYellowLight:"#FEFCEB",
        lamaLightGray:"#D3D3D3",
        lamaSilver:"#C0C0C0",
        lamaDarkGray:"#A9A9A9",
        lamaGray:"#808080",
        lamaDimGray:"#696969",
        lamaLightSlateGray:"#778899",
        lamaBlack:"#000000",
        lamaLightGray:"#D3D3D3",

      }
    },
  },
  plugins: [],
};
