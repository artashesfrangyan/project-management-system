import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Централизованный baseURL для всех API-запросов
export const BASE_URL = 'https://artashesfrangyan-project-management-system.hf.space/api/v1';

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});