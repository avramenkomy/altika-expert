import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function sendApplication(requestParams) {
  const response = await api.post(API_ENDPOINTS.APPLICATIONS, requestParams);

  return response.data;
}