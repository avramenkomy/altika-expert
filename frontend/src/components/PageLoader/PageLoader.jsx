import './PageLoader.scss';

import logo from '../../assets/images/logo.svg';

function PageLoader() {
  return (
    <div
      className="page-loader"
      role="status"
      aria-label="Загрузка страницы"
    >
      <img src={logo} alt="" className="page-loader__logo" />
    </div>
  )
}

export default PageLoader;
