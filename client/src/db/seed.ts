import { createUser } from './users';
import { createBoard } from './boards';
import { createTask } from './tasks';
import { getTasks } from './tasks';
import { getUsers } from './users';
import { getBoards } from './boards';

export const seedData = async (db: IDBDatabase): Promise<void> => {
  const users = await getUsers(db);
  const boards = await getBoards(db);
  const tasks = await getTasks(db);

  if (users.length === 0) {
    await createUser(db, { fullName: 'John Doe', email: 'john@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=1' });
    await createUser(db, { fullName: 'Jane Smith', email: 'jane@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=2' });
    await createUser(db, { fullName: 'Bob Johnson', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=3' });
  }

  if (boards.length === 0) {
    await createBoard(db, { name: 'Development', description: 'Development tasks', taskCount: 0 });
    await createBoard(db, { name: 'Design', description: 'Design tasks', taskCount: 0 });
    await createBoard(db, { name: 'Marketing', description: 'Marketing tasks', taskCount: 0 });
  }

  if (tasks.length === 0) {
    const allUsers = await getUsers(db);
    const allBoards = await getBoards(db);
    
    await createTask(db, {
      title: 'Setup project',
      description: 'Initialize project structure',
      priority: 'High',
      status: 'Done',
      assigneeId: allUsers[0].id,
      assignee: allUsers[0],
      boardId: allBoards[0].id,
      boardName: allBoards[0].name
    });

    await createTask(db, {
      title: 'Create UI mockups',
      description: 'Design main pages',
      priority: 'Medium',
      status: 'InProgress',
      assigneeId: allUsers[1].id,
      assignee: allUsers[1],
      boardId: allBoards[1].id,
      boardName: allBoards[1].name
    });

    await createTask(db, {
      title: 'Write documentation',
      description: 'Document API endpoints',
      priority: 'Low',
      status: 'Backlog',
      assigneeId: allUsers[2].id,
      assignee: allUsers[2],
      boardId: allBoards[0].id,
      boardName: allBoards[0].name
    });
  }
};
