import { useState } from 'react';
import type { NextPageWithLayout } from '../../types';
import Hamburger from '../components/Hamburger';
import HomeLayout from '../layouts/home';

const Home: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header>
        <h1>Frontend Mentor</h1>
        <h2>Feedback Board</h2>
        <Hamburger open={open} clickHandler={setOpen} />
      </header>
    </>
  );
};

Home.getLayout = (page) => {
  return (
    <HomeLayout>{page}</HomeLayout>
  );
};

export default Home;
