import { FC, PropsWithChildren } from "react";
import { TopNav, Footer, Container } from ".";

type LayoutProps = {
  is_full_width?: boolean;
};

const Layout: FC<PropsWithChildren<LayoutProps>> = ({ is_full_width, children }) => {
  return (
    <>
      <TopNav />
      <Container id="content" clean={is_full_width}>
        <main>{children}</main>
        <Footer />
      </Container>
    </>
  );
};

export default Layout;
