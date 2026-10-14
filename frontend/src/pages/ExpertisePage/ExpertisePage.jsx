import { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router';

import { ArrowLeft } from 'lucide-react';

import { getExpertiseItem } from '../../api';

import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';
import Container from '../../components/Container/Container';

import PageSeo from '../../components/PageSeo/PageSeo';

import { APPLICATION_TYPES } from '../../utils/constants';

import './ExpertisePage.scss';


function ExpertisePage() {
  const { slug } = useParams();

  const [expertise, setExpertise] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExpertise = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responseData = await getExpertiseItem(slug);

        setExpertise(responseData);
      } catch {
        setError('Не удалось загрузить информацию об экспертизе')
      } finally {
        setIsLoading(false);
      }
    }

    loadExpertise();
  }, [slug]);

  if (isLoading) {
    return (
      <Container>
        <p className="expertise-page__status">Загрузка...</p>
      </Container>
    )
  }

  if (error || !expertise) {
    return (
      <Container>
        <div className="expertise-page__status">
          <p>{error || 'Экспертиза не найдена.'}</p>

          <Link to="/">На главную</Link>
        </div>
      </Container>
    )
  }

  return (
    <>
      <PageSeo
        title={ expertise.seo_title
          || `${expertise.title} | АНО Экспертное бюро «Альтика»`
        }
        description={expertise.seo_description}
      />
      
      <article className="expertise-page">
        <header className="expertise-page__hero">
          {expertise.image &&
            <img
              className="expertise-page__hero-image"
              src={expertise.image}
              alt=""
            />
          }

          <div className="expertise-page__hero-overlay" aria-hidden="true" />

          <Container className="expertise-page__hero-container">
            <Link to="/#expertises" className="expertise-page__back">
              <ArrowLeft aria-hidden="true" />
              Все виды экспертиз
            </Link>

            <h1 className="expertise-page__title">
              {expertise.title}
            </h1>

            {expertise.short_description &&
              <p className="expertise-page__lead">
                {expertise.short_description}
              </p>
            }

            <button
              type="button"
              className="expertise-page__application"
              onClick={() => setIsApplicationOpen(true)}
            >
              Оставить заявку
            </button>
          </Container>
        </header>

        <section className="expertise-page__body">
          <Container>
            <div className="expertise-page__description">
              {expertise.description
                ?.split(/\n\s*\n/)
                .filter(Boolean)
                .map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              }
            </div>
          </Container>
        </section>
      </article>

      {isApplicationOpen &&
        <ApplicationModal
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          applicationType={APPLICATION_TYPES.EXPERTISE}
          subject={expertise.title}
        />
      }
    </>
  )
}

export default ExpertisePage;