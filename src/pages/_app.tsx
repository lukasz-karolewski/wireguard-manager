import NiceModal from "@ebay/nice-modal-react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import "~/styles/main.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Wireguard Manager</title>
      </Head>
      <SWRConfig
        value={{
          fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        }}
      >
        <NiceModal.Provider>
          {/* <ConfigProvider> */}
          <Component {...pageProps} />
          {/* </ConfigProvider> */}
        </NiceModal.Provider>
      </SWRConfig>
    </>
  );
};

export default MyApp;
