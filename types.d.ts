import type { ReactElement, ReactNode, MouseEventHandler } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
};

export type AnimationStage = 'start' | 'middle' | 'end';

export type Option = {
  content: string;
  acronym?: true;
  expansion?: string;
};

export type HamburgerProps = {
  menuState: boolean;
  menuAnimStage: AnimationStage;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
};
