import { useEffect, useState } from 'react';

import { getCompany, getSiteSettings } from '../../api';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import Hero from '../../sections/Hero/Hero';


function HomePage() {
  const [company, setCompany] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadedData = async () => {
      try {
        const [ companyData, settingsData ] = await Promise.all([
          getCompany(), getSiteSettings()
        ]);

        setCompany(companyData);
        setSettings(settingsData);
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

      <section id="about" />
      <section id="expertises" />
      <section id="valuation" />
      <section id="services" />
      <section id="experts" />
      <section id="contacts" />
    </MainLayout>
  )
}

export default HomePage;
