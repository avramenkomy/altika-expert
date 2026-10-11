import { useEffect, useState } from 'react';

import {
  getCompany,
  getCompanyAdvantages,
  getExpertises,
  getValuationTypes,
  getSiteSettings,
  getServices,
  getExperts,
} from '../../api';

import { APPLICATION_TYPES } from '../../utils/constants';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Expertises from '../../sections/Expertises/Expertises';
import Valuation from '../../sections/Valuation/Valuation';
import Services from '../../sections/Services/Services';
import Experts from '../../sections/Experts/Experts';

import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';


function HomePage() {
  const [company, setCompany] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [valuationTypes, setValuationTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);

  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  const [applicationModal, setApplicationModal] = useState({
    isOpen: false,
    applicationType: APPLICATION_TYPES.GENERAL,
    subject: '',
  });


  useEffect(() => {
    const loadedData = async () => {
      try {
        const [
          companyData,
          settingsData,
          advantagesData,
          expertisesData,
          valuationTypesData,
          servicesData,
          expertsData,
        ] = await Promise.all([
          getCompany(),
          getSiteSettings(),
          getCompanyAdvantages(),
          getExpertises(),
          getValuationTypes(),
          getServices(),
          getExperts(),
        ]);

        setCompany(companyData);
        setAdvantages(advantagesData);
        setSettings(settingsData);
        setExpertises(expertisesData);
        setValuationTypes(valuationTypesData);
        setServices(servicesData);
        setExperts(expertsData);
      } catch (error) {
        console.error('Не удалось загрузить данные сайта.', error);
        setError('Не удалось загрузить данные сайта.');
      }
    }

    loadedData();
  }, []);

  if (error) return <p>{error}</p>

  if (!company) return <p>Загрузка данных...</p>


  const openApplicationModal = ({ applicationType=APPLICATION_TYPES.GENERAL, subject='' }={}) => {
    setApplicationModal({
      isOpen: true,
      applicationType,
      subject,
    })
  }


  const closeApplicationModal = () => {
    setApplicationModal(prevState => ({
      ...prevState,
      isOpen: false
    }));
  }

  return (
    <MainLayout company={company}>
      <Hero
        company={company}
        settings={settings}
        onApplicationClick={() => openApplicationModal()}
      />

      <About company={company} advantages={advantages} />

      <Expertises expertises={expertises} />

      <Valuation valuationTypes={valuationTypes} />

      <Services
        services={services}
        onApplicationClick={service => {
          openApplicationModal({
            applicationType: APPLICATION_TYPES.SERVICE,
            subject: service.title
          });
        }}
      />

      <Experts experts={experts} />
      <section id="contacts" />

      {applicationModal.isOpen && <ApplicationModal
        isOpen={applicationModal.isOpen}
        onClose={closeApplicationModal}
        applicationType={applicationModal.applicationType}
        subject={applicationModal.subject}
      />}
    </MainLayout>
  )
}

export default HomePage;
