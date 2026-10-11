import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

import './ExpertCard.scss';


function ExpertCard({ expert }) {
  const {
    full_name: fullName, slug, photo, positions = [], specializations = [],
  } = expert;

  return (
    <article className="expert-card">
      <Link
        to={`/experts/${slug}`}
        className="expert-card__photo-wrapper"
        aria-label={`Подробнее: ${fullName}`}
      >
        {photo
          ? <img
              className="expert-card__photo"
              src={photo}
              alt=""
            />

          : <div
              className="expert-card__photo-placeholder"
              aria-hidden="true"
            >{fullName?.charAt(0)}</div>
        }
      </Link>

      <div className="expert-card__content">
        <h3 className="expert-card__name">
          {fullName}
        </h3>

        {!!positions.length &&
          <div className="expert-card__positions">
            {positions.map(pos => (
              <p key={pos.id}>
                {pos.title}
              </p>
            ))}
          </div>
        }

        {!!specializations.length &&
          <div className="expert-card__specializations">
            {specializations.map(specialization => (
              <span key={specialization.id}>
                {specialization.title}
              </span>
            ))}
          </div>
        }

        <Link
          to={`/experts/${slug}`}
          className="expert-card__link"
        >
          Подробнее
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default ExpertCard;