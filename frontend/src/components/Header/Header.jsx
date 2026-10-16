import { useState } from 'react';

import { Link } from 'react-router';

import {
  Mail, Menu, Phone, X,
} from 'lucide-react';

import Container from '../Container/Container';
import Modal from '../Modal/Modal';
import CallbackForm from '../CallbackForm/CallbackForm';

import { NAV_ITEMS } from '../../utils/constants';

import './Header.scss';

import logoWhite from '../../assets/images/logo_white.svg';


function Header({ company }) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="header">
        <Container className="header__container">
          <Link
            to="/"
            className="header__logo"
            aria-label="Экспертное бюро Альтика — на главную"
          >
            <img src={logoWhite} alt="" className="header__logo-image" />
          </Link>

          <nav
            className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}
            aria-label="Основная навигация"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                className="header__nav-link"
                to={item.to}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header__actions">
            <button
              type="button"
              className="header__callback"
              onClick={() => setCallbackOpen(true)}
            >
              Заказать звонок
            </button>

            <div className="header__contacts">
              {company?.phone &&
                <a href={`tel:${company.phone}`}>
                  <Phone aria-hidden="true" />
                  <span>{company.phone}</span>
                </a>
              }

              {company?.email &&
                <a href={`mailto:${company.email}`}>
                  <Mail aria-hidden="true" />
                  <span>{company.email}</span>
                </a>
              }
            </div>
          </div>

          <button
            type="button"
            className="header__menu-button"
            aria-label={
              menuOpen ? "Закрыть меню" : "Открыть меню"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(prevState => !prevState)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </Container>
      </header>

      {callbackOpen && <Modal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
        title="Заказать обратный звонок"
      >
        <CallbackForm />
      </Modal>}
    </>
  )
}

export default Header;