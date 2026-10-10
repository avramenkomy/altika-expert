import api from './api';

import { API_ENDPOINTS } from '../utils/constants';

/**
 * @function @async
 * @name createCallback
 *
 * @description метод вызова заявки на обратный звонок
 *
 * @param {object} requestParams параметры запроса
 * @param {string} application_type
 * @param {string} subject тема запроса, пустая строка
 * @param {string} name имя потенциального заказчика
 * @param {string} phone номер телефона потенциального заказчика
 * @param {string} email email потенциального заказчика, пустая строка
 * @param {string} message суть вопроса, пустая строка
 * @param {boolean} consent_personal_data согласие на обработку
 * персональных данных
 *
 * @returns {Promise<object>} Результат запроса
 */
export default async function createCallback(requestParams) {
  const response = await api.post(API_ENDPOINTS.APPLICATIONS, requestParams);

  return response.data;
}