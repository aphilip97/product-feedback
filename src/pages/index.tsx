import type {
  NextPageWithLayout,
  AnimationStage,
  HamburgerProps,
} from '../../types';

import {
  useEffect,
  useState,
} from 'react';

import CategoryFilter from '../components/CategoryFilter';
import Hamburger from '../components/Hamburger';

import HomeLayout from '../layouts/home';

const Home: NextPageWithLayout = () => {

  const [
    open,
    setOpen,
  ] = useState<boolean>(false);

  const [
    animStage,
    setAnimStage,
  ] = useState<AnimationStage>('start');

  const [
    selected,
    setSelected,
  ] = useState<number>(0);

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
    <>
      <div role='presentation'>
        <div
          role='presentation'
          className='overlay'
          data-animation-stage={animStage}
        ></div>
        <header>
          <h1>Frontend Mentor</h1>
          <h2>Feedback Board</h2>
          <Hamburger
            menuState={open}
            menuAnimStage={animStage}
            clickHandler={clickHandler}
          />
        </header>
        <aside data-animation-stage={animStage} >
          <CategoryFilter
            activeFilter={selected}
            changeFilter={setSelected}
          />
        </aside>
      </div>
    </>
  );
};

Home.getLayout = (page) => {
  return (
    <HomeLayout>{page}</HomeLayout>
  );
};

export default Home;
