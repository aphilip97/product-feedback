import { useCallback, useEffect, useState } from 'react';
import type { NextPageWithLayout, MenuAnimationStage, HamburgerProps } from '../../types';
import CategoryFilter from '../components/CategoryFilter';
import Hamburger from '../components/Hamburger';
import HomeLayout from '../layouts/home';

const Home: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false);
  const [animStage, setAnimStage] = useState<MenuAnimationStage>('start');
  const [selected, setSelected] = useState(0);

  const getAnimationStageOrder = useCallback<() => [
    MenuAnimationStage,
    MenuAnimationStage
  ]>(() => {
    if (!open) return ['middle', 'end'];
    return ['middle', 'start'];
  }, [open]);

  const toggleSideBar = useCallback((fnRefocus: () => void) => {
    const order = getAnimationStageOrder();
    setTimeout(() => {
      setAnimStage(order[0]);
      setTimeout(() => {
        setAnimStage(order[1]);
        setOpen(!open);
        fnRefocus();
      }, 300);
    }, 150);
  }, [getAnimationStageOrder, setAnimStage, setOpen]);

  const clickHandler = useCallback<
    HamburgerProps['clickHandler']
  >(() => {
    toggleSideBar(() => {});
  }, [toggleSideBar]);

  const refocus = useCallback(() => {
    const button = document.querySelector(
      'header > button[data-open]'
    ) as HTMLButtonElement;
    button.focus();
  }, []);

  const escapeHandler = useCallback((e: KeyboardEvent) => {
    if (open && e.code === 'Escape') toggleSideBar(refocus);
  }, [open, toggleSideBar, refocus]);

  const windowClickHandler = useCallback((e: MouseEvent) => {
    const x = window.innerWidth - 271;
    const y = 72;
    if (open && e.clientY > y && e.clientX < x) {
      toggleSideBar(() => {});
    }
  }, [open, toggleSideBar]);

  useEffect(() => {
    const html = document.querySelector('html') as HTMLHtmlElement;
    const body = document.querySelector('body') as HTMLBodyElement;
    const root = document.querySelector('div#__next') as HTMLDivElement;
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
        <div role='presentation' className='overlay' data-animation-stage={animStage}></div>
        <header>
          <h1>Frontend Mentor</h1>
          <h2>Feedback Board</h2>
          <Hamburger menuState={open} menuAnimStage={animStage} clickHandler={clickHandler} />
        </header>
        <aside data-animation-stage={animStage} >
          <CategoryFilter activeFilter={selected} changeFilter={setSelected} />
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
