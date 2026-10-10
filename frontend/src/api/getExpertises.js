import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getExpertises() {
  const response = await api.get(API_ENDPOINTS.EXPERTISES)

  return response.data;
}
