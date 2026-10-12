import { ExternalLink, FileText } from 'lucide-react';

import './DocumentCard.scss';

function DocumentCard({ document }) {
  return (
    <article className="document-card">
      {document.image
        ? <div className="document-card__preview">
            <img
              src={document.image}
              alt=""
            />
          </div>
        : <div className="document-card__placeholder" aria-hidden="true">
            <FileText />
          </div>
      }

      <div className="document-card__content">
        <h3 className="document-card__title">
          {document.title}
        </h3>

        {document.description &&
          <p className="document-card__description">
            {document.description}
          </p>
        }

        {document.file &&
          <a
            href={document.file}
            target="_blank"
            rel="noreferrer"
            className="document-card__link"
          >
            Открыть документ
            <ExternalLink aria-hidden="true" />
          </a>
        }
      </div>
    </article>
  )
}

export default DocumentCard;
