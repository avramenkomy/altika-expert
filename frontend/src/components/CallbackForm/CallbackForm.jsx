import { useState } from 'react';

import { sendCallback } from '../../api';

import { APPLICATION_TYPES, RESPONSE_STATUSES } from '../../utils/constants';

import './CallbackForm.scss';


function CallbackForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    consent_personal_data: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    message: '',
    type: '',
  });

  const handleChange = event => {
    const { name, value, checked, type } = event.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }


  const handleSubmit = async event => {
    event.preventDefault();

    setStatus({
      loading: true,
      message: '',
      type: '',
    });

    try {
      const requestParams = {
        application_type: APPLICATION_TYPES.CALLBACK,
        subject: '',
        name: formData.name,
        phone: formData.phone,
        email: '',
        message: '',
        consent_personal_data: formData.consent_personal_data,
      }

      await sendCallback(requestParams);

      setStatus({
        loading: false,
        message: 'Заявка успешно отправлена',
        type: RESPONSE_STATUSES.SUCCESS,
      });

      setFormData({
        name: '',
        phone: '',
        consent_personal_data: false,
      });

      onSuccess?.();
    } catch (error) {
      const isThrottled = error.response?.status === 429;

      setStatus({
        loading: false,
        message: isThrottled
          ? 'Слишком много запросов, повторите попытку позднее.'
          : 'Не удалось отправить заявку, попробуйте еще раз.',
        type: RESPONSE_STATUSES.ERROR,
      });
    }
  }

  return (
    <form className="callback-form" onSubmit={handleSubmit}>
      <label className="callback-form__field">
        <span>Имя</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
          required
        />
      </label>

      <label className="callback-form__field">
        <span>Телефон</span>

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="tel"
          required
        />
      </label>

      <label className="callback-form__consent">
        <input
          type="checkbox"
          name="consent_personal_data"
          checked={formData.consent_personal_data}
          onChange={handleChange}
          required
        />
        <span>Я согласен с политикой обработки персональных данных</span>
      </label>

      {status.message &&
        <p
          className={`callback-form__status callback-form__status--${status.type}`}
          role="status"
        >
          {status.message}
        </p>
      }

      <button
        type="submit"
        className="callback-form__submit"
        disabled={status.loading}
      >
        Заказать звонок
      </button>
    </form>
  )
}

export default CallbackForm;
