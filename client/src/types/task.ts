interface IAssignee {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export type ITaskStatus = 'Backlog' | 'InProgress' | 'Done';
export type ITaskPriority = 'Low' | 'Medium' | 'High';

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: ITaskPriority;
  status: ITaskStatus;
  assignee: IAssignee;
  boardName: string;
  boardId: number;
  assigneeId: number;
  createdAt: string;  // ISO 8601 format
  updatedAt: string;  // ISO 8601 format
}

export type CreateTaskData = Partial<ITask> & Pick<ITask, 'title' | 'description' | 'priority' | 'status' | 'assignee' | 'boardName' | 'boardId' | 'assigneeId'>;
export type UpdateTaskData = Partial<ITask> & { id: number };