import './PageLoader.scss';

function PageLoader() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-label="Загрузка страницы"
    >
      <div className="page-loader__logo" aria-hidden="true">A</div>
    </div>
  )
}

export default PageLoader;
