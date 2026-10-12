import Container from '../../components/Container/Container';
import DocumentCard from '../../components/DocumentCard/DocumentCard';

import './Documents.scss';


function Documents({ documents, isVisible }) {

  if (!isVisible || !documents?.length) return null;

  return (
    <section
      id="documents"
      className="documents"
      aria-labelledby="documents-title"
    >
      <Container>
        <div className="documents__header">
          <span className="documents__eyebrow">
            Документы
          </span>

          <h2 id="documents-title" className="documents__title">
            Документы компании
          </h2>

          <p className="documents__description">
            Документы, подтверждающие деятельность,
            квалификацию и компетенции компании.
          </p>
        </div>

        <div className="documents__grid">
          {documents.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Documents;
