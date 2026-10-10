import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getCompanyAdvantages() {
  const response = await api.get( API_ENDPOINTS.COMPANY_ADVANTAGES )
  
  return response.data;
}
