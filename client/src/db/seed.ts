import { createUser } from './users';
import { createBoard } from './boards';
import { createTask } from './tasks';
import { getTasks } from './tasks';
import { getUsers } from './users';
import { getBoards } from './boards';

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateTasks = (boardName: string, count: number) => {
  const taskTitles: Record<string, string[]> = {
    'Редизайн карточки товара': [
      'Реализация новой галереи изображений',
      'Адаптация карточки для мобильных устройств',
      'Оптимизация загрузки медиа-контента',
      'Добавление микроанимаций интерфейса',
      'Интеграция с системой рекомендаций'
    ],
    'Оптимизация производительности': [
      'Ленивая загрузка изображений',
      'Оптимизация бандла Webpack',
      'Реализация code-splitting',
      'Оптимизация работы с API',
      'Уменьшение времени First Contentful Paint'
    ],
    'Рефакторинг API': [
      'Оптимизация эндпоинта поиска',
      'Реализация кэширования ответов',
      'Добавление пагинации в API',
      'Оптимизация запросов к БД',
      'Рефакторинг системы авторизации'
    ],
    'Миграция на новую БД': [
      'Создание скриптов миграции',
      'Оптимизация индексов',
      'Настройка репликации',
      'Реализация резервного копирования',
      'Профилирование запросов'
    ],
    'Автоматизация тестирования': [
      'Написание E2E тестов для основного флоу',
      'Интеграция с CI/CD',
      'Реализация тестов API',
      'Создание тестов производительности',
      'Настройка алертов для тестов'
    ],
    'Переход на Kubernetes': [
      'Настройка кластера Kubernetes',
      'Реализация Helm-чартов',
      'Настройка мониторинга',
      'Конфигурация ingress-контроллеров',
      'Автоматизация деплоя'
    ]
  };

  const titles = taskTitles[boardName] || [`Задача по проекту ${boardName}`];
  return Array.from({ length: count }, (_, i) => ({
    title: titles[i % titles.length],
    description: `Детальное описание задачи ${titles[i % titles.length]}. Требует проработки технических деталей.`,
    priority: getRandomElement(['Low', 'Medium', 'High']),
    status: getRandomElement(['Backlog', 'InProgress', 'Done'])
  }));
};

export const seedData = async (db: IDBDatabase): Promise<void> => {
  const users = await getUsers(db);
  const boards = await getBoards(db);
  const tasks = await getTasks(db);

  if (users.length === 0) {
    await createUser(db, { fullName: 'Александра Ветрова', email: 'al.vetrova@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg' });
    await createUser(db, { fullName: 'Илья Романов', email: 'il.romanov@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg' });
    await createUser(db, { fullName: 'Дмитрий Козлов', email: 'dm.kozlov@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg' });
    await createUser(db, { fullName: 'Екатерина Смирнова', email: 'ek.smirnova@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg' });
    await createUser(db, { fullName: 'Артем Белов', email: 'ar.belov@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg' });
    await createUser(db, { fullName: 'Ольга Новикова', email: 'ol.novikova@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg' });
    await createUser(db, { fullName: 'Максим Орлов', email: 'mx.orlov@avito.ru', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg' });
  }

  if (boards.length === 0) {
    await createBoard(db, { name: 'Редизайн карточки товара', description: 'Обновление UI/UX основных страниц', taskCount: 0 });
    await createBoard(db, { name: 'Оптимизация производительности', description: 'Улучшение Core Web Vitals', taskCount: 0 });
    await createBoard(db, { name: 'Рефакторинг API', description: 'Оптимизация серверных методов', taskCount: 0 });
    await createBoard(db, { name: 'Миграция на новую БД', description: 'Перенос данных на PostgreSQL 15', taskCount: 0 });
    await createBoard(db, { name: 'Автоматизация тестирования', description: 'Написание E2E тестов', taskCount: 0 });
    await createBoard(db, { name: 'Переход на Kubernetes', description: 'Миграция инфраструктуры', taskCount: 0 });
  }

  if (tasks.length === 0) {
    const allUsers = await getUsers(db);
    const allBoards = await getBoards(db);
    
    for (const board of allBoards) {
      const taskCount = 5 + Math.floor(Math.random() * 6);
      const boardTasks = generateTasks(board.name, taskCount);
      
      for (const taskData of boardTasks) {
        await createTask(db, {
          ...taskData,
          assigneeId: getRandomElement(allUsers).id,
          assignee: getRandomElement(allUsers),
          boardId: board.id,
          boardName: board.name
        });
      }
    }
  }
};
