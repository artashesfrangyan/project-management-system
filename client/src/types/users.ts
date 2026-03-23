export interface IUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  description?: string;
  tasksCount?: number;
  teamId?: number;
  teamName?: string;
}

export type CreateUserData = Partial<IUser> & Pick<IUser, 'fullName' | 'email' | 'avatarUrl'>;
export type UpdateUserData = Partial<IUser> & { id: number };