export const dynamic = "force-dynamic"; //TODO https://github.com/vercel/next.js/issues/49373

import type { Metadata } from "next";

import "~/app/styles.css";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>{/* <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script> */}</head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
