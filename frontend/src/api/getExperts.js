import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getExperts() {
  const response = await api.get(API_ENDPOINTS.EXPERTS);

  return response.data;
}