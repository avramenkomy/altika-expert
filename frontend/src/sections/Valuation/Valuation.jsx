import Container from '../../components/Container/Container';
import ValuationCard from '../../components/ValuationCard/ValuationCard';

import './Valuation.scss';


function Valuation({ valuationTypes }) {
  if (!valuationTypes?.length) return null;

  return (
    <section
      id="valuation"
      className="valuation"
      aria-labelledby="valuation-title"
    >
      <Container>
        <div className="valuation__header">
          <span className="valuation__eyebrow">
            Определение стоимости
          </span>

          <h2
            id="valuation-title"
            className="valuation__title"
          >
            Оценочная деятельность
          </h2>

          <p className="valuation__description">
            Проводим независимую оценку имущества, бизнеса и других объектов
            в соответствии с действующим законодательством.
          </p>
        </div>

        <div className="valuation__grid">
          {valuationTypes.map(valuation => (
            <ValuationCard key={valuation.id} valuation={valuation} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Valuation;
