import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.tsx"],
  darkMode: "media",
  plugins: [require("@tailwindcss/forms")],
};

export default config;
