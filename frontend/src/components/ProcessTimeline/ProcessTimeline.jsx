import './ProcessTimeline.scss';

function ProcessTimeline({ steps }) {
  if (!steps?.length) return null;

  return (
    <ol className="process-timeline">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className="process-timeline__item"
        >
          <div className="process-timeline__marker" aria-hidden="true">
            {index + 1}
          </div>

          <article className="process-timeline__content">
            <h3 className="process-timeline__title">
              {step.title}
            </h3>

            {step.description &&
              <p className="process-timeline__description">
                {step.description}
              </p>
            }
          </article>
        </li>
      ))}
    </ol>
  )
}

export default ProcessTimeline;
