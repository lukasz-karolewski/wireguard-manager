import React from "react";

function Footer() {
  const version = process.env.VERSION;

  return (
    <footer className="py-8 mx-auto text-sm text-center">
      &copy; {new Date().getFullYear()} lk | {version || "development"}
    </footer>
  );
}

export default Footer;
