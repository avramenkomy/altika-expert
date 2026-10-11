import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getServices() {
  const response = await api.get(API_ENDPOINTS.SERVICES);

  return response.data;
}