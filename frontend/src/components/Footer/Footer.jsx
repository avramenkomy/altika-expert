import { Link } from 'react-router';

import {
  Mail,
  Phone,
} from 'lucide-react';

import Container from '../Container/Container';

import './Footer.scss';

import logoWhite from '../../assets/images/logo_white.svg';


function Footer({ company }) {
  if (!company) return null;

  const {
    name,
    short_name: shortName,
    phone,
    phone_secondary: phoneSecondary,
    email,
    address,
    inn,
    kpp,
    ogrn,
  } = company;

  const currentYear = new Date().getFullYear();

  const phoneHref = value => (
    `tel:${value.replace(/[^\d+]/g, '')}`
  );

  return (
    <footer className="footer">
      <Container>
        <div className="footer__content">
          <div className="footer__company">
            <Link
              to="/"
              className="footer__logo"
              aria-label="Экспертное бюро Альтика — на главную"
            >
              <img src={logoWhite} alt="" className="footer__logo-image" />

              <span>
                {shortName || 'Экспертное бюро «Альтика»'}
              </span>
            </Link>

            {name && (
              <p className="footer__company-name">
                {name}
              </p>
            )}

            {address && (
              <p className="footer__address">
                {address}
              </p>
            )}
          </div>

          <nav
            className="footer__nav"
            aria-label="Навигация в подвале"
          >
            <span className="footer__heading">
              Навигация
            </span>

            <a href="#about">О компании</a>
            <a href="#expertises">Виды экспертиз</a>
            <a href="#valuation">Оценка</a>
            <a href="#services">Услуги</a>
            <a href="#experts">Эксперты</a>
            <a href="#contacts">Контакты</a>
          </nav>

          <div className="footer__contacts">
            <span className="footer__heading">
              Контакты
            </span>

            {phone && (
              <a href={phoneHref(phone)}>
                <Phone aria-hidden="true" />
                {phone}
              </a>
            )}

            {phoneSecondary && (
              <a href={phoneHref(phoneSecondary)}>
                <Phone aria-hidden="true" />
                {phoneSecondary}
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`}>
                <Mail aria-hidden="true" />
                {email}
              </a>
            )}
          </div>

          <div className="footer__requisites">
            <span className="footer__heading">
              Реквизиты
            </span>

            {inn && <span>ИНН {inn}</span>}
            {kpp && <span>КПП {kpp}</span>}
            {ogrn && <span>ОГРН {ogrn}</span>}
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {currentYear} {shortName || name}
          </span>

          <span>
            Все права защищены
          </span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;