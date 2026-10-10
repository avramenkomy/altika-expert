import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import './ValuationCard.scss';


function ValuationCard({ valuation }) {
  const {
    title, slug, short_description: description, image, price_from: priceFrom
  } = valuation;

  return (
    <article className="valuation-card">
      {image &&
        <img
          className="valuation-card__image"
          src={image}
          alt=""
        />
      }

      <div className="valuation-card__overlay" />

      <div className="valuation-card__content">
        <h3 className="valuation-card__title">
          {title}
        </h3>

        {description &&
          <p className="valuation-card__description">
            {description}
          </p>
        }

        {priceFrom &&
          <p className="valuation-card__price">
            от {Number(priceFrom).toLocaleString('ru-RU')} ₽
          </p>
        }

        <Link
          to={`/valuation/${slug}`}
          className="valuation-card__link"
        >
          Подробнее
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default ValuationCard;
