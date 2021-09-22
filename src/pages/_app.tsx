import '../styles/globals.sass';
import type { AppPropsWithLayout } from '../../types';
import { useEffect } from 'react';

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {

  useEffect(() => {
    document.getElementById('__next')?.setAttribute('role', 'presentation');
  }, []);

  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);

};

export default MyApp;
