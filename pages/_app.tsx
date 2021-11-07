import React from 'react';
import type { AppProps } from 'next/app';
import PropTypes from 'prop-types';
import 'tailwindcss/tailwind.css';
import WalletContextProvider from '../context/wallet';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletContextProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
};

export default MyApp;
