import Container from '../../components/Container/Container';
import ExpertCard from '../../components/ExpertCard/ExpertCard';

import './Experts.scss';


function Experts({ experts}) {
  if (!experts?.length) return null;

  return (
    <section
      id="experts"
      className="experts"
      aria-labelledby="experts-title"
    >
      <Container>
        <div className="experts__header">
          <span className="experts__eyebrow">
            Наша команда
          </span>

          <h2 id="experts__title" className="experts__title">
            Эксперты и оценщики
          </h2>

          <p className="experts__description">
            Специалисты с профильным образованием и практическим
            опытом проведения экспертиз и оценочных исследований.
          </p>
        </div>

        <div className="experts__grid">
          {experts.map(expert => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Experts;
