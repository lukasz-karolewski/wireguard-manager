import { Metadata } from "next";

import Container from "~/app/ui/common/container";
import Footer from "~/app/ui/common/footer";
import TopNav from "~/app/ui/common/top-nav";

import "~/app/ui/styles.css";

export const metadata: Metadata = {
  title: "Wireguard Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TopNav />
        <Container id="content" is_full_width={false}>
          <main>{children}</main>
          <Footer />
        </Container>
      </body>
    </html>
  );
}
