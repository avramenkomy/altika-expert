import { Check } from 'lucide-react';

import Container from '../../components/Container/Container';

import './UseCases.scss';


function UseCases({ useCases }) {
  if (!useCases?.length) return null;



  return (
    <section
      className="use-cases"
      aria-labelledby="use-cases-title"
    >
      <Container>
        <div className="use-cases__content">
          <div className="use-cases__header">
            <span
              className="use-cases__eyebrow"
            >
              Когда необходимо обратиться к специалистам
            </span>

            <h2
              id="use-cases-title"
              className="use-cases__title"
            >
              Судебная экспертиза и оценка необходима в следующих ситуациях:
            </h2>
          </div>

          <ul className="use-cases__list">
            {useCases.map(useCase => (
              <li
                key={useCase.id}
                className="use-cases__item"
              >
                <span
                  className="use-cases__icon"
                  aria-hidden="true"
                >
                  <Check />
                </span>

                <div className="use-cases__text">
                  <h3 className="use-cases__item-title">
                    {useCase.title}
                  </h3>

                  {useCase.description && (
                    <p className="use-cases__item-description">
                      {useCase.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}

export default UseCases;
