import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


/**
 * @function @async
 * @name getValuationTypes
 *
 * @description получение данных о видах оценок
 *
 * @returns {Promise<Array>} массив видов оценок
 */
export default async function getValuationTypes() {
  const response = await api.get(API_ENDPOINTS.VALUATION_TYPES);

  return response.data;
}