import Container from '../../components/Container/Container';
import ServiceCard from '../../components/ServiceCard/ServiceCard';

import './Services.scss';


function Services({ services, onApplicationClick }) {
  return (
    <section
      id="services"
      className="services"
      aria-labelledby="services-title"
    >
      <Container>
        <div className="services__header">
          <span className="services__eyebrow">
            Дополнительные услуги
          </span>

          <h2
            id="services-title"
            className="services__title"
          >
            Услуги
          </h2>

          <p className="services__description">
            Подготавливаем экспертные и оценочные документы,
            сопровождаем судебные и досудебные процедуры.
          </p>
        </div>

        <div className="services__grid">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onApplicationClick={onApplicationClick}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Services;
