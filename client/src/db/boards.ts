import { IBoard, CreateBoardData } from '../types/board';

export const getBoards = (db: IDBDatabase): Promise<IBoard[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('boards', 'readonly');
    const store = transaction.objectStore('boards');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createBoard = (db: IDBDatabase, board: CreateBoardData): Promise<IBoard> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('boards', 'readwrite');
    const store = transaction.objectStore('boards');
    const request = store.add(board);

    request.onsuccess = async () => {
      const newBoard = await getBoardById(db, request.result as number);
      resolve(newBoard!);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getBoardById = (db: IDBDatabase, id: number): Promise<IBoard | undefined> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('boards', 'readonly');
    const store = transaction.objectStore('boards');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
