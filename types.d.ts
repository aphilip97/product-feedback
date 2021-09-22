import type { ReactElement, ReactNode, MouseEventHandler } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
};

export type MenuAnimationStage = 'start' | 'middle' | 'end';

export type HamburgerProps = {
  menuState: boolean;
  menuAnimStage: MenuAnimationStage;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
};
