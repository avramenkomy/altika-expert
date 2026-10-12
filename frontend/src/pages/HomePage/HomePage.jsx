import { useEffect, useState } from 'react';

import {
  getCompany,
  getCompanyAdvantages,
  getExpertises,
  getValuationTypes,
  getSiteSettings,
  getServices,
  getExperts,
  getProcessSteps,
  getUseCases,
  getCompanyDocuments,
} from '../../api';

import { APPLICATION_TYPES, PROCESS_TYPES } from '../../utils/constants';

import MainLayout from '../../layouts/MainLayout/MainLayout';
import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Expertises from '../../sections/Expertises/Expertises';
import Valuation from '../../sections/Valuation/Valuation';
import Services from '../../sections/Services/Services';
import Experts from '../../sections/Experts/Experts';
import ProcessSection from '../../sections/ProcessSection/ProcessSection';
import UseCases from '../../sections/UseCases/UseCases';
import Documents from '../../sections/Documents/Documents';
import ApplicationSection from '../../sections/ApplicationSection/ApplicationSection';
import Contacts from '../../sections/Contacts/Contacts';

import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';


function HomePage() {
  const [company, setCompany] = useState(null);
  const [advantages, setAdvantages] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [valuationTypes, setValuationTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [experts, setExperts] = useState([]);
  const [expertiseProcess, setExpertiseProcess] = useState([]);
  const [valuationProcess, setValuationProcess] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [documents, setDocuments] = useState([]);

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
          expertiseProcessData,
          valuationProcessData,
          useCasesData,
          documentsData,
        ] = await Promise.all([
          getCompany(),
          getSiteSettings(),
          getCompanyAdvantages(),
          getExpertises(),
          getValuationTypes(),
          getServices(),
          getExperts(),
          getProcessSteps(PROCESS_TYPES.EXPERTISE),
          getProcessSteps(PROCESS_TYPES.VALUATION),
          getUseCases(),
          getCompanyDocuments(),
        ]);

        setCompany(companyData);
        setAdvantages(advantagesData);
        setSettings(settingsData);
        setExpertises(expertisesData);
        setValuationTypes(valuationTypesData);
        setServices(servicesData);
        setExperts(expertsData);
        setExpertiseProcess(expertiseProcessData);
        setValuationProcess(valuationProcessData);
        setUseCases(useCasesData);
        setDocuments(documentsData);
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

      <ProcessSection
        id="expertise-process"
        eyebrow="Как мы работаем"
        title="Процесс проведения судебной экспертизы"
        description="Основные этапы взаимодействия с заказчиком и судом — от первоначального запроса до участия эксперта в судебном заседании."
        steps={expertiseProcess}
        alternate
      />

      <ProcessSection
        id="valuation-process"
        eyebrow="Этапы оценки"
        title="Процесс оказания оценочных услуг"
        description="Последовательный процесс от первичной консультации и получения документов до подготовки отчёта и дальнейшего сопровождения."
        steps={valuationProcess}
      />

      <UseCases useCases={useCases} />

      <Documents
        documents={documents}
        isVisible={settings?.show_documents_page}
      />

      <ApplicationSection />

      <Contacts company={company} />

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
