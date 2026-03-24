import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { dbService } from '@/db/indexedDB';
import { ITask, CreateTaskData, UpdateTaskData } from '@/types/task';

interface BaseQueryArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

interface BaseQueryError {
  status: number;
  data: string;
}

export const baseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  BaseQueryError
> = async ({ url, method = 'GET', body }) => {
  try {
    await dbService.init();

    const segments = url.split('/').filter(Boolean);
    const [resource, action, id] = segments;

    if (resource === 'tasks') {
      if (method === 'GET') {
        const data = await dbService.getTasks();
        return { data: { data } };
      }

      if (action === 'create' && method === 'POST') {
        const taskData = body as CreateTaskData;
        const data = await dbService.createTask(taskData);
        return { data };
      }

      if (action === 'update' && method === 'PUT') {
        const updateData = { 
          ...(body as Partial<ITask>), 
          id: Number(id) 
        } as UpdateTaskData;
        
        const data = await dbService.updateTask(updateData);
        return { data };
      }

      if (action === 'updateStatus' && method === 'PUT') {
        const statusUpdate = body as { status: ITask['status'] };
        const data = await dbService.updateTask({ 
          id: Number(id), 
          status: statusUpdate.status 
        } as UpdateTaskData);
        return { data };
      }
    }

    if (resource === 'boards') {
      if (method === 'GET') {
        if (!action) {
          const data = await dbService.getBoards();
          return { data: { data } };
        }
        const data = await dbService.getBoardTasks(Number(action));
        return { data: { data } };
      }
    }

    if (resource === 'users' && method === 'GET') {
      const data = await dbService.getUsers();
      return { data: { data } };
    }

    return { 
      error: { status: 404, data: `Resource ${resource} not found` } 
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    return { 
      error: { status: 500, data: message } 
    };
  }
};
