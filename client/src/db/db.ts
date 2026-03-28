import { ITask, CreateTaskData, UpdateTaskData } from '@/types/task';
import { IBoard, CreateBoardData } from '@/types/board';
import { IUser, CreateUserData } from '@/types/users';
import { STORES, INDEXES } from './constants';
import { init, exec, execIndex, deleteDB } from './core';

const getById = <T>(storeName: string, id: number) => 
  exec<T>(storeName, 'readonly', store => store.get(id));

const put = <T>(storeName: string, data: T) => 
  exec(storeName, 'readwrite', store => store.put(data)).then(() => data);

const clear = (storeName: string) => 
  exec(storeName, 'readwrite', store => store.clear());

// Tasks
const getTasks = () => 
  exec<ITask[]>(STORES.TASKS, 'readonly', store => store.getAll());

const getBoardTasks = (boardId: number) => 
  execIndex<ITask>(STORES.TASKS, INDEXES.BOARD_ID, boardId);

const createTask = async (data: CreateTaskData): Promise<ITask> => {
  const assignee = await getById<IUser>(STORES.USERS, data.assigneeId);
  if (!assignee) throw new Error(`Assignee ${data.assigneeId} not found`);

  const now = new Date().toISOString();
  const id = await exec<IDBValidKey>(STORES.TASKS, 'readwrite', store => 
    store.add({
      ...data,
      assignee: {
        id: assignee.id!,
        fullName: assignee.fullName,
        email: assignee.email,
        avatarUrl: assignee.avatarUrl,
      },
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    })
  );
  return getById<ITask>(STORES.TASKS, Number(id));
};

const updateTask = async (data: UpdateTaskData): Promise<ITask> => {
  const existing = await getById<ITask>(STORES.TASKS, data.id!);
  if (!existing) throw new Error(`Task ${data.id} not found`);

  let assignee = existing.assignee;
  if (data.assigneeId && data.assigneeId !== existing.assigneeId) {
    const newAssignee = await getById<IUser>(STORES.USERS, data.assigneeId);
    if (newAssignee) {
      assignee = {
        id: newAssignee.id!,
        fullName: newAssignee.fullName,
        email: newAssignee.email,
        avatarUrl: newAssignee.avatarUrl,
      };
    }
  }

  return put<ITask>(STORES.TASKS, {
    ...existing,
    ...data,
    assignee,
    updatedAt: new Date().toISOString(),
  });
};

// Boards
const getBoards = () => 
  exec<IBoard[]>(STORES.BOARDS, 'readonly', store => store.getAll());

const createBoard = async (data: CreateBoardData): Promise<IBoard> => {
  const id = await exec<IDBValidKey>(STORES.BOARDS, 'readwrite', store => store.add(data));
  return getById<IBoard>(STORES.BOARDS, Number(id));
};

// Users
const getUsers = () => 
  exec<IUser[]>(STORES.USERS, 'readonly', store => store.getAll());

const createUser = async (data: CreateUserData): Promise<IUser> => {
  const id = await exec<IDBValidKey>(STORES.USERS, 'readwrite', store => store.add(data));
  return getById<IUser>(STORES.USERS, Number(id));
};

// Utility
const clearAllData = async () => {
  await clear(STORES.TASKS);
  await clear(STORES.BOARDS);
  await clear(STORES.USERS);
};

export const dbService = {
  init,
  getTasks,
  getById: <T>(storeName: string, id: number) => getById<T>(storeName, id),
  createTask,
  updateTask,
  getBoardTasks,
  getBoards,
  createBoard,
  getUsers,
  createUser,
  clearAllData,
  deleteDatabase: deleteDB,
};
