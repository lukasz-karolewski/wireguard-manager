import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import forms_plugin from "@tailwindcss/forms";

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
  plugins: [forms_plugin],
};

export default config;
