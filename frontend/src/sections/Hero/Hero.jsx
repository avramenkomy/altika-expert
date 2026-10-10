import Container from '../../components/Container/Container';

import './Hero.scss';

function Hero(props) {
  const { company, settings, onApplicationClick } = props;

  const heroStyle = settings?.hero_image
    ? {'--hero-background': `url("${settings.hero_image}")`}
    : undefined

  return (
    <section
      id="top"
      className="hero"
      style={heroStyle}
    >
      <Container className="hero__container">
        <div className="hero__content">
          <h1 className="hero__title">
            {settings?.hero_title ||
              "Центр инженерно-технических экспертиз, финансово-экономических экспертиз и оценочных услуг"
            }
          </h1>

          {settings?.hero_subtitle &&
            <p className="hero__subtitle">
              {settings.hero_subtitle}
            </p>
          }

          {company?.phone &&
            <p className="hero__phone">
              Задайте вопрос по телефону{" "}
              <a href={`tel:${company.phone}`}>
                {company.phone}
              </a>
            </p>
          }

          <div className="hero__actions">
            <button
              type="button"
              className="hero__button"
              onClick={onApplicationClick}
            >
              Оставить заявку
            </button>

            <span>или просто оставьте заявку на сайте</span>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Hero;
