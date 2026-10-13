import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getServiceItem(slug) {
  const response = await api.get(`${API_ENDPOINTS.SERVICES}${slug}/`);

  return response.data;
}