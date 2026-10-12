import Container from '../../components/Container/Container';
import ApplicationForm from '../../components/ApplicationForm/ApplicationForm';

import { APPLICATION_TYPES } from '../../utils/constants';

import './ApplicationSection.scss';


function ApplicationSection() {
  return (
    <section
      id="application"
      className="application-section"
      aria-labelledby="application-section-title"
    >
      <Container>
        <div className="application-section__content">
          <div className="application-section__info">
            <span className="application-section__eyebrow">
              Оставить заявку
            </span>

            <h2
              id="application-section-title"
              className="application-section__title"
            >
              Нужна консультация специалиста
            </h2>

            <p className="application-section__description">
              Опишите ваш вопрос, и наш специалист свяжется с вами,
              чтобы уточнить детали и предложить дальнейший порядок действий.
            </p>
          </div>

          <div className="application-section__form">
            <ApplicationForm applicationType={APPLICATION_TYPES.GENERAL} />
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ApplicationSection;
