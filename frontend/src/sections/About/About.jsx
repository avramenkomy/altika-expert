import Container from '../../components/Container/Container';

import './About.scss';

function About(props) {
  const { company, advantages } = props;

  const paragraphs = company?.description?.split(/\n\s*\n/).filter(Boolean);

  return (
    <section
      id="about"
      className="about"
      aria-labelledby="about-title"
    >
      <Container>
        <div className="about__header">
          <span className="about__eyebrow">
            Экспертное бюро "Альтика"
          </span>

          <h2
            id="about-title"
            className="about__title"
          >
            О нашей компании
          </h2>
        </div>

        <div className="about__content">
          <div className="about__description">
            {paragraphs?.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>

          {!!advantages?.length &&
            <div className="about__advantages">
              {advantages.map(advantage => (
                <article
                  key={advantage.id}
                  className="about__advantage"
                >
                  <h3>{advantage.title}</h3>

                  {advantage.description &&
                    <p>{advantage.description}</p>
                  }
                </article>
              ))}
            </div>
          }
        </div>
      </Container>
    </section>
  )
}

export default About;
