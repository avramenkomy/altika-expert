import { useEffect, useState } from 'react';

import {
  getCompany,
  getCompanyAdvantages,
  getExpertises,
  getSiteSettings
} from '../../api';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Expertises from '../../sections/Expertises/Expertises';


function HomePage() {
  const [company, setCompany] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [expertises, setExpertises] = useState([]);

  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadedData = async () => {
      try {
        const [
          companyData,
          settingsData,
          advantagesData,
          expertisesData,
        ] = await Promise.all([
          getCompany(),
          getSiteSettings(),
          getCompanyAdvantages(),
          getExpertises(),
        ]);

        setCompany(companyData);
        setAdvantages(advantagesData);
        setSettings(settingsData);
        setExpertises(expertisesData);
      } catch (error) {
        console.error('Не удалось загрузить данные сайта.', error);
        setError('Не удалось загрузить данные сайта.');
      }
    }

    loadedData();
  }, []);

  if (error) return <p>{error}</p>

  if (!company) return <p>Загрузка данных...</p>

  return (
    <MainLayout company={company}>
      <Hero
        company={company}
        settings={settings}
        onApplicationClick={() => { console.log('Open application modal')}}
      />

      <About company={company} advantages={advantages} />

      <Expertises expertises={expertises} />

      <section id="valuation" />
      <section id="services" />
      <section id="experts" />
      <section id="contacts" />
    </MainLayout>
  )
}

export default HomePage;
