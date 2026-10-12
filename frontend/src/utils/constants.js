// типы заявок
export const APPLICATION_TYPES = {
  CALLBACK: 'callback',     // обратный звонок
  GENERAL: 'general',       // общая заявка
  EXPERTISE: 'expertise',   // заявка на заключение эксперта
  VALUATION: 'valuation',   // заявка на отчет об оценке
  SERVICE: 'service',       // заявка на услугу
}

// типы статусов ответов на запросы
export const RESPONSE_STATUSES = {
  SUCCESS: 'success',
  ERROR: 'error',
}

// api endpoints
export const API_ENDPOINTS = {
  COMPANY: 'company/',
  COMPANY_ADVANTAGES: 'company/advantages/',
  EXPERTISES: 'company/expertises/',
  VALUATION_TYPES: 'company/valuation/',
  SERVICES: 'services/',
  COMPANY_PROCESSES: 'company/processes/',
  COMPANY_DOCUMENTS: 'company/documents/',
  SITE_SETTINGS: 'company/settings/',
  APPLICATIONS: 'applications/',
  EXPERTS: 'experts/',
  USE_CASES: 'company/use-cases/',
}


// Типы процессов при проведении экспертизы или оценки
export const PROCESS_TYPES = {
  EXPERTISE: 'expertise',
  VALUATION: 'valuation',
}
