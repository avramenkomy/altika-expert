import { Link } from 'react-router';

import Container from '../../components/Container/Container';
import PageSeo from '../../components/PageSeo/PageSeo';

import './NotFoundPage.scss';


function NotFoundPage() {
  return (
    <>
      <PageSeo
        title="Страница не найдена | Экспертное бюро «Альтика»"
        description="Запрашиваемая страница не найдена."
        noIndex
      />

      <section className="not-found">
        <Container>
          <div className="not-found__content">
            <span className="not-found__code">404</span>

            <h1 className="not-found__title">Страница не найдена</h1>

            <p className="not-found__description">
              Возможно, страница была перемещена,
              удалена или адрес указан неверно.
            </p>

            <Link
              to="/"
              className="not-found__link"
            >
              Вернуться на главную
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

export default NotFoundPage;
