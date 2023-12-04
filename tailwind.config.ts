import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["./src/**/*.tsx"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        accent: colors.gray[700],
        highlight: colors.orange[300],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
