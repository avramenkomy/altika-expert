import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getUseCases() {
  const response = await api.get(API_ENDPOINTS.USE_CASES);

  return response.data;
}
