import { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router';

import { ArrowLeft } from 'lucide-react';

import { getServiceItem } from '../../api';

import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';
import Container from '../../components/Container/Container';
import PageSeo from '../../components/PageSeo/PageSeo';

import { APPLICATION_TYPES } from '../../utils/constants';

import './ServicePage.scss';


function ServicePage() {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responseData = await getServiceItem(slug);

        setService(responseData);
      } catch {
        setError('Не удалось загрузить информацию об услуге.')
      } finally {
        setIsLoading(false);
      }
    }

    loadService();
  }, [slug]);

  if (isLoading) {
    return (
      <Container>
        <p className="service-page__status">Загрузка...</p>
      </Container>
    )
  }

  if (error || !service) {
    return (
      <Container>
        <div className="service-page__status">
          <p>{error || 'Услуга не найдена.'}</p>

          <Link to="/">На главную</Link>
        </div>
      </Container>
    )
  }

  return (
    <>
      <PageSeo
        title={service.seo_title
          || `${service.title} | АНО Экспертное бюро «Альтика»`
        }
        description={service.seo_description}
        path={`/services/${service.slug}`}
        image={service.image}
      />

      <article className="service-page">
        <header className="service-page__hero">
          {service.image &&
            <img
              className="service-page__hero-image"
              src={service.image}
              alt=""
            />
          }

          <div className="service-page__hero-overlay" aria-hidden="true" />

          <Container className="service-page__hero-container">
            <Link to="/#services" className="service-page__back">
              <ArrowLeft aria-hidden="true" />
              Все услуги
            </Link>

            <h1 className="service-page__title">
              {service.title}
            </h1>

            {service.short_description &&
              <p className="service-page__lead">
                {service.short_description}
              </p>
            }

            {service.price_from &&
              <p className="service-page__price">
                от {' '}
                {Number(service.price_from).toLocaleString('ru-Ru')}
                {' '}₽
              </p>
            }

            <button
              type="button"
              className="service-page__application"
              onClick={() => setIsApplicationOpen(true)}
            >
              Оставить заявку
            </button>
          </Container>
        </header>

        <section className="service-page__body">
          <Container>
            <div className="service-page__description">
              {service.description
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
          applicationType={APPLICATION_TYPES.SERVICE}
          subject={service.title}
        />
      }
    </>
  )
}

export default ServicePage;