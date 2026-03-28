export const DB_NAME = 'ProjectManagementDB';
export const DB_VERSION = 1;

export const STORES = {
  TASKS: 'tasks',
  BOARDS: 'boards',
  USERS: 'users',
} as const;

export const INDEXES = {
  BOARD_ID: 'boardId',
  STATUS: 'status',
  ASSIGNEE_ID: 'assigneeId',
  CREATED_AT: 'createdAt',
} as const;
