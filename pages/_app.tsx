import React from 'react';
import type { AppProps } from 'next/app';
import PropTypes from 'prop-types';
import 'tailwindcss/tailwind.css';
import WalletContextProvider from '../context/wallet';
import GridContextProvider from '../context/grid';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <GridContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GridContextProvider>
    </WalletContextProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
};

export default MyApp;
