import { useState } from 'react';

import { sendApplication } from '../../api';
import { APPLICATION_TYPES, RESPONSE_STATUSES } from '../../utils/constants';

import './ApplicationForm.scss';

const INIT_FORM = {
  name: '',
  phone: '',
  email: '',
  message: '',
  consent_personal_data: false,
}


function ApplicationForm(props) {
  const {
    applicationType=APPLICATION_TYPES.GENERAL,
    subject='',
    onSuccess,
  } = props;

  const [form, setForm] = useState(INIT_FORM);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = event => {
    const { name, value, type, checked } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors(prevState => ({
      ...prevState,
      [name]: undefined,
    }));
  }


  const handleSubmit = async event => {
    event.preventDefault();

    setStatus(null);
    setErrors({});
    setIsSubmitting(true);

    try {
      const requestParams = {
        application_type: applicationType,
        subject,
        ...form,
      }

      await sendApplication(requestParams);

      setForm(INIT_FORM);
      setStatus(RESPONSE_STATUSES.SUCCESS);

      onSuccess?.();
    } catch (error) {
      const responseErrors = error.response?.data;

      if (responseErrors && typeof responseErrors === 'object') {
        setErrors(responseErrors);
      }

      setStatus(RESPONSE_STATUSES.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      {subject &&
        <p className="application-form__subject">
          {subject}
        </p>
      }

      <div className="application-form__field">
        <label htmlFor="application-name">Ваше имя</label>

        <input
          id="application-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />

        <span
          className="application-form__error"
          data-visible={Boolean(errors.name)}
        >
          {errors?.name || "\u00A0"}
        </span>
      </div>


      <div className="application-form__field">
        <label htmlFor="application-phone">Телефон</label>

        <input
          id="application-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <span
          className="application-form__error"
          data-visible={Boolean(errors.phone)}
        >
          {errors?.phone || "\u00A0"}
        </span>
      </div>

      <div className="application-form__field">
        <label htmlFor="application-email">Ваш email</label>

        <input
          id="application-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <span
          className="application-form__error"
          data-visible={Boolean(errors.email)}
        >
          {errors?.email || "\u00A0"}
        </span>
      </div>

      <div className="application-form__field">
        <label htmlFor="application-message">Ваш вопрос</label>

        <textarea
          id="application-message"
          name="message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        />

        <span
          className="application-form__error"
          data-visible={Boolean(errors.message)}
        >
          {errors?.message || "\u00A0"}
        </span>
      </div>

      <div className="application-form__consent-wrapper">
        <label className="application-form__consent">
          <input
            name="consent_personal_data"
            type="checkbox"
            checked={form.consent_personal_data}
            onChange={handleChange}
            required
          />

          <span>Я согласен на обработку персональных данных</span>
        </label>

        <span
          className="application-form__error"
          data-visible={Boolean(errors.consent_personal_data)}
        >
          {errors?.consent_personal_data || "\u00A0"}
        </span>
      </div>

      <button
        type="submit"
        className="application-form__submit"
        disabled={isSubmitting}
      >
        Отправить заявку
      </button>

      <div className="application-form__status">
        {status === RESPONSE_STATUSES.SUCCESS &&
          <p className="application-form__success">
            Заявка успешно отправлена.
          </p>
        }

        {status === RESPONSE_STATUSES.ERROR &&
          <p className="application-form__error">
            Не удалось отправить заявку, проверьте данные.
          </p>
        }
      </div>
    </form>
  )
}

export default ApplicationForm;
