import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import './ServiceCard.scss';


function ServiceCard({ service, onApplicationClick }) {
  const {
    title, slug, short_description: description, price_from: priceFrom
  } = service;

  return (
    <article className="service-card">
      <div className="service-card__content">
        <h3 className="service-card__title">
          {title}
        </h3>

        {description &&
          <p className="service-card__description">
            {description}
          </p>
        }

        {priceFrom &&
          <p className="service-card__price">
            от {Number(priceFrom).toLocaleString('ru-Ru')} ₽
          </p>
        }
      </div>

      <div className="service-card__actions">
        <Link
          to={`/services/${slug}`}
          className="service-card__link"
        >
          Подробнее
          <ArrowRight aria-hidden="true" />
        </Link>

        <button
          type="button"
          className="service-card__application"
          onClick={() => onApplicationClick?.(service)}
        >
          Оставить заявку
        </button>
      </div>
    </article>
  )
}

export default ServiceCard;
