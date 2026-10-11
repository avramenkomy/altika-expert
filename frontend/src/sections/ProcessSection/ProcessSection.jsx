import Container from '../../components/Container/Container';
import ProcessTimeline from '../../components/ProcessTimeline/ProcessTimeline';

import './ProcessSection.scss';


function ProcessSection(props) {
  const {
    id, eyebrow, title, description, steps, alternate=false
  } = props;

  if (!steps?.length) return null;

  const className = [
    'process-section',
    alternate && 'process-section__alternate',
  ]
  .filter(Boolean)
  .join(' ');

  return (
    <section
      id={id}
      className={className}
      aria-labelledby={`${id}_title`}
    >
      <Container>
        <div className="process-section__header">
          <span className="process-section__eyebrow">
            {eyebrow}
          </span>

          <h2 className="process-section__title" id={`${id}__title`}>
            {title}
          </h2>

          {description &&
            <p className="process-section__description">
              {description}
            </p>
          }
        </div>

        <div className="process-section__timeline">
          <ProcessTimeline steps={steps} />
        </div>
      </Container>
    </section>
  )
}

export default ProcessSection;
