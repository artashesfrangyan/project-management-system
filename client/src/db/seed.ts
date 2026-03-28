import { STORES } from './constants';
import { exec } from './core';
import { IUser } from '../types/users';
import { IBoard } from '../types/board';
import usersData from './data/users.json';
import boardsData from './data/boards.json';
import tasksData from './data/tasks.json';

const getAll = <T>(storeName: string) => 
  exec<T[]>(storeName, 'readonly', store => store.getAll());

const add = (storeName: string, data: unknown) => 
  exec<IDBValidKey>(storeName, 'readwrite', store => store.add(data));

export const seedDatabase = async (): Promise<void> => {
  const existingUsers = await getAll(STORES.USERS);
  if (existingUsers.length > 0) return;

  for (const user of usersData.users) {
    await add(STORES.USERS, user);
  }

  for (const board of boardsData.boards) {
    await add(STORES.BOARDS, { ...board, taskCount: 0 });
  }

  const allUsers = await getAll(STORES.USERS);
  const allBoards = await getAll(STORES.BOARDS);

  for (const boardTasks of tasksData.tasks) {
    const board = (allBoards as IBoard[]).find(b => b.id === boardTasks.boardId);
    if (!board) continue;

    for (const task of boardTasks.tasks) {
      const assignee = (allUsers as IUser[]).find(u => u.id === task.assigneeId);
      if (!assignee) continue;

      await add(STORES.TASKS, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assigneeId: task.assigneeId,
        assignee: {
          id: assignee.id,
          fullName: assignee.fullName,
          email: assignee.email,
          avatarUrl: assignee.avatarUrl,
        },
        boardId: board.id,
        boardName: board.name,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    }
  }
};
