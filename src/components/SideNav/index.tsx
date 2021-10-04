import type {
  AnimationStage,
  HamburgerProps,
} from '../../../types';

import {
  useEffect,
  useState,
} from 'react';

import Hamburger from '../Hamburger';

import styles from './index.module.sass';

type SideNavProps = {
  productName: string;
};

const SideNav: React.FC<SideNavProps> = ({
  productName,
  children
}) => {

  const [
    open,
    setOpen,
  ] = useState<boolean>(false);

  const [
    animStage,
    setAnimStage,
  ] = useState<AnimationStage>('start');

  const getAnimationStageOrder = (): [
    AnimationStage,
    AnimationStage
  ] => {
    if (!open) return ['middle', 'end'];
    return ['middle', 'start'];
  };

  const toggleSideBar = (fnRefocus: () => void) => {
    const order = getAnimationStageOrder();
    setTimeout(() => {
      setAnimStage(order[0]);
      setTimeout(() => {
        setAnimStage(order[1]);
        setOpen(!open);
        fnRefocus();
      }, 300);
    }, 150);
  };

  const clickHandler: HamburgerProps['clickHandler'] = () => {
    toggleSideBar(() => {});
  };

  const refocus = () => {
    const button = document.querySelector(
      'header > button[data-open]'
    ) as HTMLButtonElement;
    button.focus();
  };

  const escapeHandler = (e: KeyboardEvent) => {
    if (open && e.code === 'Escape') toggleSideBar(refocus);
  };

  const windowClickHandler = (e: MouseEvent) => {
    const x = window.innerWidth - 271;
    const y = 72;
    if (open && e.clientY > y && e.clientX < x) {
      toggleSideBar(() => {});
    }
  };

  useEffect(() => {

    const html = document.querySelector(
      'html'
    ) as HTMLHtmlElement;

    const body = document.querySelector(
      'body'
    ) as HTMLBodyElement;

    const root = document.querySelector(
      'div#__next'
    ) as HTMLDivElement;

    html.style.overflowY = open ? 'hidden' : '';
    body.style.overflowY = open ? 'hidden' : '';
    root.style.overflowY = open ? 'hidden' : '';

  }, [open]);

  useEffect(() => {

    window.addEventListener('keyup', escapeHandler);
    window.addEventListener('click', windowClickHandler);

    return () => {
      window.removeEventListener('keyup', escapeHandler);
      window.removeEventListener('click', windowClickHandler);
    };

  }, [open]);

  return (
    <div role="presentation" className={styles['sidenav']}>
      <div
        role='presentation'
        className={styles['overlay']}
        data-animation-stage={animStage}
      ></div>
      <header>
        <h1>{productName}</h1>
        <h2>Feedback Board</h2>
        <Hamburger
          menuState={open}
          menuAnimStage={animStage}
          clickHandler={clickHandler}
        />
      </header>
      <aside data-animation-stage={animStage} >
        {children}
      </aside>
    </div>
  );
};

export default SideNav;
