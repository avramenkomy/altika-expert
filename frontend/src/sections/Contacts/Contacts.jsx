import {
  Clock3, Mail, MapPin, MessageCircle, Phone, Send,
} from 'lucide-react';

import Container from '../../components/Container/Container';
// import YandexMap from '../../components/YandexMap/YandexMap';
import LeafletMap from '../../components/LeafletMap/LeafletMap';

import './Contacts.scss';

function Contacts({ company }) {
  if (!company) return null;

  const {
    name,
    phone,
    phone_secondary: phoneSecondary,
    email,
    telegram,
    whatsapp,
    address,
    working_hours: workingHours,
    latitude,
    longitude,
  } = company;

  const phoneRef = val => `tel:${val.replace(/[^\d+]/g, '')}`;

  return (
    <section
      id="contacts"
      className="contacts"
      aria-labelledby="contacts-title"
    >
      <Container>
        <div className="contacts__header">
          <span className="contacts__eyebrow">
            Контакты
          </span>

          <h2
            id="contacts-title"
            className="contacts__title"
          >
            Свяжитесь с нами
          </h2>

          <p className="contacts__description">
            Ответим на вопросы и подскажем,
            как начать работу по вашей задаче.
          </p>
        </div>

        <div className="contacts__layout">
          <div className="contacts__info">
            {phone &&
              <div className="contacts__item">
                <Phone aria-hidden="true" />
                <div>
                  <span className="contacts__label">Телефон</span>

                  <a href={phoneRef(phone)}>{phone}</a>

                  {phoneSecondary &&
                    <a href={phoneRef(phoneSecondary)}>
                      {phoneSecondary}
                    </a>
                  }
                </div>
              </div>
            }

            {email &&
              <div className="contacts__item">
                <Mail aria-hidden="true" />

                <div>
                  <span className="contacts__label">Email</span>

                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              </div>
            }

            {address &&
              <div className="contacts__item">
                <MapPin aria-hidden="true" />

                <div>
                  <span className="contacts__label">Адрес</span>
                  <p>{address}</p>
                </div>
              </div>
            }

            {workingHours &&
              <div className="contacts__item">
                <Clock3 aria-hidden="true" />

                <div>
                  <span>Режим работы</span>

                  <p>{workingHours}</p>
                </div>
              </div>
            }

            {(telegram || whatsapp) &&
              <div className="contacts__socials">
                {telegram &&
                  <a href={telegram} target="_blank" rel="noreferrer">
                    <Send aria-hidden="true" />
                    Telegram
                  </a>
                }

                {whatsapp &&
                  <a href={whatsapp} target="_blank" rel="noreferrer">
                    <MessageCircle aria-hidden="true" />
                    WhatsApp
                  </a>
                }
              </div>
            }

          </div>

          <LeafletMap
            latitude={latitude}
            longitude={longitude}
            title={name}
            address={address}
          />

          {/* <YandexMap
            latitude={latitude}
            longitude={longitude}
            title={name}
            address={address}
          /> */}
        </div>
      </Container>
    </section>
  )
}

export default Contacts;