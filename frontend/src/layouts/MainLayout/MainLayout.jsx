import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { getCompany } from '../../api';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';


function MainLayout() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await getCompany();

        setCompany(data);
      } catch (error) {
        console.error('Company loading error:', error);
      }
    };

    loadCompany();
  }, []);

  return (
    <>
      <Header company={company} />

      <main>
        <Outlet context={{ company }} />
      </main>

      <Footer company={company} />
    </>
  );
}

export default MainLayout;