import { DB_NAME, DB_VERSION, STORES, INDEXES } from './constants';
import { seedDatabase } from './seed';

let db: IDBDatabase | null = null;
let initPromise: Promise<IDBDatabase> | null = null;
let isSeeded = false;

const setupStores = (database: IDBDatabase): void => {
  if (!database.objectStoreNames.contains(STORES.TASKS)) {
    const taskStore = database.createObjectStore(STORES.TASKS, { keyPath: 'id', autoIncrement: true });
    taskStore.createIndex(INDEXES.BOARD_ID, 'boardId', { unique: false });
    taskStore.createIndex(INDEXES.STATUS, 'status', { unique: false });
    taskStore.createIndex(INDEXES.ASSIGNEE_ID, 'assigneeId', { unique: false });
    taskStore.createIndex(INDEXES.CREATED_AT, 'createdAt', { unique: false });
  }
  if (!database.objectStoreNames.contains(STORES.BOARDS)) {
    database.createObjectStore(STORES.BOARDS, { keyPath: 'id', autoIncrement: true });
  }
  if (!database.objectStoreNames.contains(STORES.USERS)) {
    database.createObjectStore(STORES.USERS, { keyPath: 'id', autoIncrement: true });
  }
};

export const init = async (): Promise<IDBDatabase> => {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      db.onclose = () => {
        db = null;
        initPromise = null;
        isSeeded = false;
      };
      resolve(db);
    };

    request.onupgradeneeded = () => {
      setupStores(request.result);
    };
  });

  await initPromise;
  
  if (!isSeeded) {
    await seedDatabase();
    isSeeded = true;
  }
  
  return db!;
};

export const exec = async <R>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<R>
): Promise<R> => {
  if (!db) throw new Error('Database not initialized');
  return new Promise((resolve, reject) => {
    const tx = db!.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = callback(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const execIndex = async <T>(
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<T[]> => {
  if (!db) throw new Error('Database not initialized');
  return new Promise((resolve, reject) => {
    const tx = db!.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteDB = async (): Promise<void> => {
  if (db) {
    db.close();
    db = null;
    initPromise = null;
    isSeeded = false;
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
