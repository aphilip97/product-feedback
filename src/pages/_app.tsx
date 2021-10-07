import type {
  AppPropsWithLayout,
} from '../../types';

import {
  ReactElement,
  useEffect,
} from 'react';

import '../styles/globals.sass';

const MyApp = (props: AppPropsWithLayout) => {

  const { Component, pageProps } = props;

  useEffect(() => {
    const root = document.getElementById(
      '__next'
    ) as HTMLDivElement | null;
    root?.setAttribute('role', 'presentation');
  }, []);

  const getLayout = Component.getLayout ?? (
    (page: ReactElement) => page
  );

  return getLayout(<Component {...pageProps} />);

};

export default MyApp;
