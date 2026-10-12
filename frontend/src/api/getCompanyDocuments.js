import api from './api';

import { API_ENDPOINTS } from '../utils/constants';


export default async function getCompanyDocuments() {
  const response = await api.get(API_ENDPOINTS.COMPANY_DOCUMENTS);

  return response.data;
}
