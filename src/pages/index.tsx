import type {
  NextPageWithLayout,
} from '../../types';

import {
  useState,
} from 'react';

import CategoryFilter from '../components/CategoryFilter';
import SideNav from '../components/SideNav';

import HomeLayout from '../layouts/home';

const Home: NextPageWithLayout = () => {

  const [
    selected,
    setSelected,
  ] = useState<number>(0);

  return (
    <>
      <SideNav productName="Frontend Mentor" >
        <CategoryFilter
          activeFilter={selected}
          changeFilter={setSelected}
        />
      </SideNav>
    </>
  );

};

Home.getLayout = (page) => {
  return (
    <HomeLayout>{page}</HomeLayout>
  );
};

export default Home;
