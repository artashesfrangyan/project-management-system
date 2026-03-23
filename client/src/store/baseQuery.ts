import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { dbService } from '../db/indexedDB';
import { ITask } from '../types/task';

export const baseQuery: BaseQueryFn<
  { url: string; method?: string; body?: unknown },
  unknown,
  unknown
> = async ({ url, method = 'GET', body }) => {
  try {
    await dbService.init();

    const parts = url.split('/');
    const resource = parts[1];
    const action = parts[2];
    const id = parts[3];

    if (resource === 'tasks') {
      if (method === 'GET') {
        const data = await dbService.getTasks();
        return { data: { data } };
      }
      if (action === 'create' && method === 'POST') {
        const data = await dbService.createTask(body as Partial<ITask>);
        return { data };
      }
      if (action === 'update' && method === 'PUT') {
        const data = await dbService.updateTask({ ...(body as Partial<ITask>), id: Number(id) });
        return { data };
      }
      if (action === 'updateStatus' && method === 'PUT') {
        const data = await dbService.updateTask({ id: Number(id), status: (body as { status: ITask['status'] }).status });
        return { data };
      }
    }

    if (resource === 'boards') {
      if (method === 'GET' && !action) {
        const data = await dbService.getBoards();
        return { data: { data } };
      }
      if (method === 'GET' && action) {
        const data = await dbService.getBoardTasks(Number(action));
        return { data: { data } };
      }
    }

    if (resource === 'users' && method === 'GET') {
      const data = await dbService.getUsers();
      console.log('Users from DB:', data);
      return { data: { data } };
    }

    return { error: { status: 404, data: 'Not found' } };
  } catch (error) {
    return { error: { status: 500, data: error } };
  }
};