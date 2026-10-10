import Container from '../../components/Container/Container';
import ExpertiseCard from '../../components/ExpertiseCard/ExpertiseCard';

import './Expertises.scss';

function Expertises({ expertises }) {
  if (!expertises?.length) return null;

  return (
    <section
      id="expertises"
      className="expertises"
      aria-labelledby="expertises-title"
    >
      <Container>
        <div className="expertises__header">
          <span className="expertises__eyebrow">
            Направления работы
          </span>

          <h2
            id="expertises-title"
            className="expertises__title"
          >
            Виды экспертиз
          </h2>

          <p className="expertises__description">
            Проводим судебные и внесудебные исследования
            по основным экспертным направлениям.
          </p>
        </div>

        <div className="expertises__grid">
          {expertises.map(expertise => (
            <ExpertiseCard
              key={expertise.id}
              expertise={expertise}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Expertises;
