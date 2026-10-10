import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import './ExpertiseCard.scss';


function ExpertiseCard({ expertise }) {
  const { title, slug, short_description: description, image } = expertise;

  return (
    <article className="expertise-card">
      <Link
        to={`/expertises/${slug}`}
        className="expertise-card__image-wrapper"
        aria-label={`Подробнее: ${title}`}
      >
        {image
          ? <img className="expertise-card__image" src={image} alt="" />
          : <div className="expertise-card__image-placeholder" aria-hidden="true" />
        }
      </Link>

      <div className="expertise-card__content">
        <h3 className="expertise-card__title">{title}</h3>

        {description &&
          <p className="expertise-card__description">
            {description}
          </p>
        }

        <Link
          to={`/expertises/${slug}`}
          className="expertise-card__link"
        >
          Подробнее
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default ExpertiseCard;
