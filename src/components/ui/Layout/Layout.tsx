import React, { FC } from "react";
import { Container, Footer, TopNav } from "~/components/ui";

type LayoutProps = {
  is_full_width?: boolean;
};

const Layout: FC<React.PropsWithChildren<LayoutProps>> = ({ is_full_width, children }) => {
  return (
    <>
      <TopNav />
      <Container id="content" clean={is_full_width}>
        <main className="content-min-height">{children}</main>
        <Footer />
      </Container>
    </>
  );
};

export default Layout;
