import { initDB } from './init';
import { getTasks, createTask, updateTask, getBoardTasks } from './tasks';
import { getBoards, createBoard } from './boards';
import { getUsers, createUser } from './users';
import { seedData } from './seed';
import { ITask } from '../types/task';
import { IBoard } from '../types/board';
import { IUser } from '../types/users';

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    this.db = await initDB();
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) await this.init();
    return this.db!;
  }

  async getTasks() {
    const db = await this.ensureDB();
    return getTasks(db);
  }

  async createTask(task: Partial<ITask>) {
    const db = await this.ensureDB();
    return createTask(db, task);
  }

  async updateTask(task: Partial<ITask>) {
    const db = await this.ensureDB();
    return updateTask(db, task);
  }

  async getBoardTasks(boardId: number) {
    const db = await this.ensureDB();
    return getBoardTasks(db, boardId);
  }

  async getBoards() {
    const db = await this.ensureDB();
    return getBoards(db);
  }

  async createBoard(board: Partial<IBoard>) {
    const db = await this.ensureDB();
    return createBoard(db, board);
  }

  async getUsers() {
    const db = await this.ensureDB();
    return getUsers(db);
  }

  async createUser(user: Partial<IUser>) {
    const db = await this.ensureDB();
    return createUser(db, user);
  }

  async seedData() {
    const db = await this.ensureDB();
    return seedData(db);
  }
}

export const dbService = new IndexedDBService();
