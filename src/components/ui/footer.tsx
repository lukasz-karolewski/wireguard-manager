function Footer() {
  const version = process.env.VERSION;

  return (
    <footer className="mx-auto py-8 text-center text-sm">
      &copy; {new Date().getFullYear()} lk | {version || "development"}
    </footer>
  );
}

export default Footer;
