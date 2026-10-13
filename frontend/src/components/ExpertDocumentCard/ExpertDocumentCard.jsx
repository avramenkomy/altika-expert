import './ExpertDocumentCard.scss';

function ExpertDocumentCard({ document }) {
  return (
    <article className="expert-document-card">
      <div className="expert-document-card__preview">
        <img
          src={document.image}
          alt={document.title || document.document_type_display} />
      </div>

      <div className="expert-document-card__content">
        <span className="expert-document-card__type">
          {document.document_type_display}
        </span>

        {document.title &&
          <h3 className="expert-document-card__title">
            {document.title}
          </h3>
        }
      </div>
    </article>
  )
}

export default ExpertDocumentCard;
