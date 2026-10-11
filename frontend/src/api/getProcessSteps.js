import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getProcessSteps(processType) {
  const response = await api.get(
    `${API_ENDPOINTS.COMPANY_PROCESSES}${processType}/`
  );

  return response.data;
}
