import { IUser, CreateUserData } from '../types/users';

export const getUsers = (db: IDBDatabase): Promise<IUser[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const createUser = (db: IDBDatabase, user: CreateUserData): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);

    request.onsuccess = async () => {
      const newUser = await getUserById(db, request.result as number);
      resolve(newUser!);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getUserById = (db: IDBDatabase, id: number): Promise<IUser | undefined> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
