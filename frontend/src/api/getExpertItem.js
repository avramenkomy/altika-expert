import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getExpertItem(slug) {
  const response = await api.get(`${API_ENDPOINTS.EXPERTS}${slug}/`);

  return response.data;
}