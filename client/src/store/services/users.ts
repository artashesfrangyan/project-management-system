import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../../types/users';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://artashesfrangyan-project-management-system.hf.space/api/v1' }),
  tagTypes: ['Users'],  // Теги для кэширования
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => '/users',
      transformResponse: (response: { data: IUser[] }) => response.data,
      providesTags: ['Users'],
    })
  }),
});

export const { useGetUsersQuery } = usersApi;