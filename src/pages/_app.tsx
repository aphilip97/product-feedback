import '../styles/globals.sass';
import type { AppPropsWithLayout } from '../../types';

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {

  const getLayout = Component.getLayout ?? (page => page);

  return getLayout(<Component {...pageProps} />);

};

export default MyApp;
