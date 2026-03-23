import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../baseQuery';
import { ITask, ITaskStatus } from '../../types/task';
import { IBoard } from '../../types/board';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery,
  tagTypes: ['Tasks', 'Boards', 'Board'], // Теги для кэширования
  endpoints: (builder) => ({
    // Методы для Tasks

    getTasks: builder.query<ITask[], void>({
      query: () => '/tasks',
      transformResponse: (response: { data: ITask[] }) => response.data,
      providesTags: ['Tasks'],
    }),
    
    createTask: builder.mutation<ITask, Partial<ITask>>({
      query: (task) => ({
        url: '/tasks/create',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks', 'Board'],
    }),
    
    updateTask: builder.mutation<ITask, Partial<ITask>>({
      query: (task) => ({
        url: `/tasks/update/${task.id}`,
        method: 'PUT',
        body: {
          assigneeId: task.assigneeId, 
          description: task.description,
          priority: task.priority,
          status: task.status,
          title: task.title
        },
      }),
      invalidatesTags: ['Tasks', 'Board'],
    }),

    updateTaskStatus: builder.mutation<ITask, IUpdateStatus>({
        query: ({id, status}) => ({
            url: `/tasks/updateStatus/${id}`,
            method: 'PUT',
            body: {status},
        }),
        invalidatesTags: ['Tasks', 'Board'],
    }),

    // Методы для работы с Boards

    getBoards: builder.query<IBoard[], void>({
      query: () => '/boards',
      transformResponse: (response: { data: IBoard[] }) => response.data,
      providesTags: ['Boards'],
    }),
    
    getBoardTasks: builder.query<ITask[], string>({
      query: (id: string) => `/boards/${id}`,
      providesTags: ['Board'],
      transformResponse: (response: { data: ITask[] }) => response.data,
    })
}),
});
interface IUpdateStatus {
  id: number
  status: ITaskStatus
}

export const {
  useGetTasksQuery, 
  useCreateTaskMutation, 
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,

  useGetBoardsQuery, 
  useGetBoardTasksQuery 
} = tasksApi;