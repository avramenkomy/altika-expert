import api from './api';

import { API_ENDPOINTS } from '../utils/constants';

/**
 * @function @async
 * @name getCompany
 * @description получение информации о компании
 *
 * @returns {Promise<object>} данные компании
 */
export default async function getCompany() {
  const response = await api.get(API_ENDPOINTS.COMPANY);

  return response.data
}
