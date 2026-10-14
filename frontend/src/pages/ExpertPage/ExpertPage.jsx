import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';

import {
  ArrowLeft, Award, BriefcaseBusiness, GraduationCap,
} from 'lucide-react';

import { getExpertItem } from '../../api';

import Container from '../../components/Container/Container';
import ApplicationModal from '../../components/ApplicationModal/ApplicationModal';
import ExpertDocumentCard from '../../components/ExpertDocumentCard/ExpertDocumentCard';

import { APPLICATION_TYPES } from '../../utils/constants';

import './ExpertPage.scss';


function ExpertPage() {
  const { slug } = useParams();

  const [expert, setExpert] = useState(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExpertData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const responseData = await getExpertItem(slug);

        setExpert(responseData);
      } catch {
        setError('Не удалось загрузить информацию о специалисте.')
      } finally {
        setIsLoading(false);
      }
    }

    loadExpertData();
  }, [slug]);

  useEffect(() => {
    if (!expert) return;

    document.title = expert.seo_title
      || `${expert.full_name} | Экспертное бюро "Альтика"`;

    const description = document.querySelector('meta[name="description"]');

    if (description && expert.seo_description) {
      description.setAttribute(
        'content',
        expert.seo_description
      )
    }
  }, [expert]);

  if (isLoading) {
    return (
      <Container>
        <p className="expert-page__status">Загрузка...</p>
      </Container>
    )
  }

  if (error || !expert) {
    return (
      <Container>
        <div className="expert-page__status">
          <p>{error || 'Эксперт не найден.'}</p>

          <Link to="/">На главную</Link>
        </div>
      </Container>
    )
  }

  const {
    full_name: fullName, photo, positions=[], specializations=[], biography,
    qualification, education, experience, documents=[],
  } = expert;

  return (
    <>
      <article className="expert-page">
        <section className="expert-page__hero">
          <Container>
            <Link
              to="/#experts"
              className="expert-page__back"
            >
              <ArrowLeft aria-hidden="true" />
              Все специалисты
            </Link>

            <div className="expert-page__hero-content">
              <div className="expert-page__photo-wrapper">
                {photo
                  ? <img className="expert-page__photo" src={photo} alt="" />
                  : <div
                      className="expert-page__photo-placeholder"
                      aria-hidden="true"
                    >
                      {fullName?.charAt(0)}
                    </div>
                }
              </div>

              <div className="expert-page__hero-info">
                <span className="expert-page__eyebrow">
                  Специалист
                </span>

                <h1 className="expert-page__title">
                  {fullName}
                </h1>

                {!!positions.length &&
                  <div className="expert-page__positions">
                    {positions.map(pos => (
                      <p key={pos.id}>{pos.title}</p>
                    ))}
                  </div>
                }

                {!!specializations.length &&
                  <div className="expert-page__specializations">
                    {specializations.map(specialization => (
                      <span key={specialization.id}>
                        {specialization.title}
                      </span>
                    ))}
                  </div>
                }

                <button
                  type="button"
                  className="expert-page__application"
                  onClick={() => setIsApplicationOpen(true)}
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          </Container>
        </section>

        {biography &&
          <section className="expert-page__about">
            <Container>
              <div className="expert-page__section-content">
                <span className="expert-page__section-eyebrow">
                  О специалисте
                </span>

                <h2 className="expert-page__section-title">
                  Профессиональная деятельность
                </h2>

                <div className="expert-page__text">
                  {
                    biography
                      .split(/\n\s*\n/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                  }
                </div>
              </div>
            </Container>
          </section>
        }

        {(qualification || education) &&
          <section className="expert-page__details">
            <Container>
              <div className="expert-page__details-grid">
                {qualification &&
                  <div className="expert-page__detail-card">
                    <div className="expert-page__detail-heading">
                      <Award aria-hidden="true" />

                      <h2>Квалификация</h2>
                    </div>

                    <div className="expert-page__detail-text">
                      {
                        qualification
                          .split(/\n\s*\n/)
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))
                      }
                    </div>
                  </div>
                }

                {education &&
                  <div className="expert-page__detail-card">
                    <div className="expert-page__detail-heading">
                      <GraduationCap aria-hidden="true" />

                      <h2>Образование</h2>
                    </div>

                    <div className="expert-page__detail-text">
                      {
                        education
                          .split(/\n\s*\n/)
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))
                      }
                    </div>
                  </div>
                }
              </div>
            </Container>
          </section>
        }

        {experience &&
          <section className="expert-page__experience">
            <Container>
              <div className="expert-page__section-content">
                <div className="expert-page__section-icon">
                  <BriefcaseBusiness aria-hidden="true" />
                </div>

                <span className="expert-page__section-eyebrow">
                  Профессиональный опыт
                </span>

                <h2 className="expert-page__section-title">
                  Опыт работы
                </h2>

                <div className="expert-page__text">
                  {
                    experience
                      .split(/\n\s*\n/)
                      .filter(Boolean)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                  }
                </div>
              </div>
            </Container>
          </section>
        }

        {!!documents.length &&
          <section className="expert-page__documents">
            <Container>
              <div className="expert-page__documents-header">
                <span className="expert-page__section-eyebrow">
                  Подтвержденная квалификация
                </span>

                <h2 className="expert-page__section-title">
                  Документы специалиста
                </h2>

                <div className="expert-page__documents-grid">
                  {documents.map(document => (
                    <ExpertDocumentCard
                      key={document.id}
                      document={document}
                    />
                  ))}
                </div>
              </div>
            </Container>
          </section>
        }

        <section className="expert-page__cta">
          <Container>
            <div className="expert-page__cta-content">
              <div>
                <span className="expert-page__cta-eyebrow">
                  Консультация
                </span>

                <h2 className="expert-page__cta-title">
                  Нужна консультация специалиста?
                </h2>

                <p className="expert-page__cta-description">
                  Оставьте заявку, и мы свяжемся с вами,
                  чтобы уточнить детали вашего вопроса.
                </p>
              </div>

              <button
                type="button"
                className="expert-page__cta-button"
                onClick={() => setIsApplicationOpen(true)}
              >
                Оставить заявку
              </button>
            </div>
          </Container>
        </section>
      </article>

      {isApplicationOpen &&
        <ApplicationModal
          isOpen={isApplicationOpen}
          onClose={() => setIsApplicationOpen(false)}
          applicationType={APPLICATION_TYPES.GENERAL}
          subject={`Консультация специалиста ${fullName}`}
        />
      }
    </>
  )
}

export default ExpertPage;
