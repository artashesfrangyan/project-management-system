import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';
import { IUser } from '../../types/users';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
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