import type { Config } from "tailwindcss";

import forms_plugin from "@tailwindcss/forms";
import colors from "tailwindcss/colors";

const config: Config = {
  content: ["./src/**/*.tsx"],
  darkMode: "media",
  plugins: [forms_plugin],
  theme: {
    extend: {
      colors: {
        accent: colors.gray[700],
        highlight: colors.orange[300],
      },
    },
  },
};

export default config;
