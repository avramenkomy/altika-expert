import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getExpertiseItem(slug) {
  const response = await api.get(`${API_ENDPOINTS.EXPERTISES}${slug}/`);

  return response.data;
}
