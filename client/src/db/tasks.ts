import { ITask, CreateTaskData, UpdateTaskData } from '../types/task';
import { getUserById } from './users';

export const getTasks = (db: IDBDatabase): Promise<ITask[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readonly');
    const store = transaction.objectStore('tasks');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createTask = async (db: IDBDatabase, task: CreateTaskData): Promise<ITask> => {
  const assignee = await getUserById(db, task.assigneeId);
  if (!assignee) {
    throw new Error('Assignee not found');
  }

  const taskToCreate = {
    ...task,
    assignee: {
      id: assignee.id,
      fullName: assignee.fullName,
      email: assignee.email,
      avatarUrl: assignee.avatarUrl
    }
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.add(taskToCreate);

    request.onsuccess = async () => {
      try {
        const newTask = await getTaskById(db, request.result as number);
        resolve(newTask!);
      } catch (e) {
        reject(e);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

export const updateTask = async (db: IDBDatabase, task: UpdateTaskData): Promise<ITask> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const getRequest = store.get(task.id!);

    getRequest.onsuccess = async () => {
      try {
        const existingTask = getRequest.result;
        const updatedTask = { ...existingTask, ...task };

        if (task.assigneeId && task.assigneeId !== existingTask.assigneeId) {
          const assignee = await getUserById(db, task.assigneeId);
          if (assignee) {
            updatedTask.assignee = {
              id: assignee.id,
              fullName: assignee.fullName,
              email: assignee.email,
              avatarUrl: assignee.avatarUrl
            };
          }
        }

        const putRequest = store.put(updatedTask);
        putRequest.onsuccess = () => resolve(updatedTask);
        putRequest.onerror = () => reject(putRequest.error);
      } catch (e) {
        reject(e);
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

export const getTaskById = (db: IDBDatabase, id: number): Promise<ITask | undefined> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readonly');
    const store = transaction.objectStore('tasks');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getBoardTasks = (db: IDBDatabase, boardId: number): Promise<ITask[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readonly');
    const store = transaction.objectStore('tasks');
    const index = store.index('boardId');
    const request = index.getAll(boardId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
