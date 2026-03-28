# Database Layer

## Структура
- `constants.ts` - константы БД (имена stores и индексов)
- `core.ts` - низкоуровневая работа с IndexedDB
- `seed.ts` - начальное заполнение данными
- `db.ts` - высокоуровневый API для работы с данными

## Инициализация
```typescript
await dbService.init(); // Вызывать ОДИН раз в main.tsx
```

## Важно
- `init()` должен вызываться только в `main.tsx` перед рендером
- `exec()` и `execIndex()` работают с уже инициализированной БД
- Seed выполняется автоматически при первом запуске
- Повторные вызовы `init()` возвращают уже готовую БД

## API
```typescript
dbService.getTasks()           // Все задачи
dbService.getBoardTasks(id)    // Задачи доски
dbService.createTask(data)     // Создать задачу
dbService.updateTask(data)     // Обновить задачу
dbService.getBoards()          // Все доски
dbService.getUsers()           // Все пользователи
dbService.clearAllData()       // Очистить все данные
dbService.deleteDatabase()     // Удалить БД
```
