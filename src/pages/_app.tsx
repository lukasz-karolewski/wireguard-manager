import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import "~/styles/main.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Wireguard Manager</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
