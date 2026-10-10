import api from './api';

import { API_ENDPOINTS } from '../utils/constants';

/**
 * @function @async
 * @name getSiteSettings
 * @description получение настроек сайта
 *
 * @returns {Promise<object>} настройки сайта
 */
export default async function getSiteSettings() {
  const response = await api.get(API_ENDPOINTS.SITE_SETTINGS);

  return response.data
}