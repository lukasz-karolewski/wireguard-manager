import NiceModal from "@ebay/nice-modal-react";
import Head from "next/head";
import { SWRConfig } from "swr";
import "~/app/ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <Head>
        <title>Wireguard Manager</title>
      </Head>
      <body>
        <SWRConfig
          value={{
            fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
          }}
        >
          <NiceModal.Provider>{children}</NiceModal.Provider>
        </SWRConfig>
      </body>
    </html>
  );
}
