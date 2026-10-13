import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getValuationItem(slug) {
  const response = await api.get(`${API_ENDPOINTS.VALUATION_TYPES}${slug}/`);

  return response.data;
}