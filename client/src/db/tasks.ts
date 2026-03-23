import { ITask } from '../types/task';

export const getTasks = (db: IDBDatabase): Promise<ITask[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readonly');
    const store = transaction.objectStore('tasks');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createTask = (db: IDBDatabase, task: Partial<ITask>): Promise<ITask> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const request = store.add(task);

    request.onsuccess = async () => {
      const newTask = await getTaskById(db, request.result as number);
      resolve(newTask!);
    };
    request.onerror = () => reject(request.error);
  });
};

export const updateTask = (db: IDBDatabase, task: Partial<ITask>): Promise<ITask> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('tasks', 'readwrite');
    const store = transaction.objectStore('tasks');
    const getRequest = store.get(task.id!);

    getRequest.onsuccess = () => {
      const existingTask = getRequest.result;
      const updatedTask = { ...existingTask, ...task };
      const putRequest = store.put(updatedTask);

      putRequest.onsuccess = () => resolve(updatedTask);
      putRequest.onerror = () => reject(putRequest.error);
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
