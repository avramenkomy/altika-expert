import { useEffect, useState } from 'react';

import { Link, useParams } from 'react-router';

import { ArrowLeft } from 'lucide-react';

import { getValuationItem } from '../../api';

import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';
import Container from '../../components/Container/Container';
import PageSeo from '../../components/PageSeo/PageSeo';

import { APPLICATION_TYPES } from '../../utils/constants';

import './ValuationPage.scss';


function ValuationPage() {
  const { slug } = useParams();

  const [valuation, setValuation] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadValuation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responseData = await getValuationItem(slug);

        setValuation(responseData);
      } catch {
        setError('Не удалось загрузить информацию об оценке.')
      } finally {
        setIsLoading(false);
      }
    }

    loadValuation();
  }, [slug]);

  if (isLoading) {
    return (
      <Container>
        <p className="valuation-page__status">Загрузка...</p>
      </Container>
    )
  }

  if (error || !valuation) {
    return (
      <Container>
        <div className="valuation-page__status">
          <p>{error || 'Вид оценки не найден.'}</p>

          <Link to="/">На главную</Link>
        </div>
      </Container>
    )
  }

  return (
    <>
      <PageSeo
        title={valuation.seo_title
          || `${valuation.title} | АНО Экспертное бюро «Альтика»`
        }
        description={valuation.seo_description}
        path={`/valuation/${valuation.slug}`}
        image={valuation.image}
      />

      <article className="valuation-page">
        <header className="valuation-page__hero">
          {valuation.image &&
            <img
              className="valuation-page__hero-image"
              src={valuation.image}
              alt=""
            />
          }

          <div className="valuation-page__hero-overlay" aria-hidden="true" />

          <Container className="valuation-page__hero-container">
            <Link to="/#valuation" className="valuation-page__back">
              <ArrowLeft aria-hidden="true" />
              Все виды оценок
            </Link>

            <h1 className="valuation-page__title">
              {valuation.title}
            </h1>

            {valuation.short_description &&
              <p className="valuation-page__lead">
                {valuation.short_description}
              </p>
            }

            <button
              type="button"
              className="valuation-page__application"
              onClick={() => setIsApplicationOpen(true)}
            >
              Оставить заявку
            </button>
          </Container>
        </header>

        <section className="valuation-page__body">
          <Container>
            <div className="valuation-page__description">
              {valuation.description
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
          applicationType={APPLICATION_TYPES.VALUATION}
          subject={valuation.title}
        />
      }
    </>
  )
}

export default ValuationPage;