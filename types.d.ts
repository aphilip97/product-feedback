import type {
  ReactElement,
  ReactNode,
  MouseEventHandler,
} from 'react';

import type {
  NextPage,
} from 'next';

import type {
  AppProps,
} from 'next/app';

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement<T>) => ReactNode;
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

export type PatchBody = {
  title?: string;
  category?: string;
  status?: string;
  content?: string;
};

export type HamburgerProps = {
  menuState: boolean;
  menuAnimStage: AnimationStage;
  clickHandler: MouseEventHandler<HTMLButtonElement>;
};

interface FormElements extends HTMLFormControlsCollection {
  titleInput: HTMLInputElement;
  detailInput: HTMLTextAreaElement;
};

export interface FeedbackForm extends HTMLFormElement {
  readonly elements: FormElements;
};
