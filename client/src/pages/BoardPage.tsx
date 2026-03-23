import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useGetBoardsQuery, useGetBoardTasksQuery, useUpdateTaskStatusMutation } from '@/store/services/tasks';
import { ITask } from '@/types/task';
import TaskColumn from '@/components/TaskBoard/TaskColumn';
import { useParams } from 'react-router-dom';
import { IBoard } from '@/types/board';
import { setBoardId } from '@/store/slices/boardIdSlice';
import { useDispatch } from 'react-redux';

const STATUSES: ITask['status'][] = ['Backlog', 'InProgress', 'Done'];
const COLUMN_NAMES = {
  Backlog: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done'
};

const TaskBoard = () => {
  const { id } = useParams<{id: string}>();
  const dispatch = useDispatch();
  
  const { data: boardsData } = useGetBoardsQuery();
  const { data: tasks = [], isLoading, isError } = useGetBoardTasksQuery(id || '', {
    skip: !id
  });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  useEffect(() => {
    if (id) {
      dispatch(setBoardId(Number(id)));
    }
  }, [id, dispatch]);

  // Находим текущую доску по id
  const currentBoardName = useMemo(() => {
    return boardsData?.find((board: IBoard) => board.id === Number(id))?.name;
  }, [boardsData, id]);

  // Маппинг статусов
  const statusMap = useMemo(() => {
    return STATUSES.reduce((acc, status) => {
      acc[status] = tasks ? tasks.filter(task => task.status === status) : [];
      return acc;
    }, {} as Record<ITask['status'], ITask[]>);
  }, [tasks]);

  const handleDrop = useCallback(async (id: number, newStatus: ITask['status']) => {
    try {
      await updateTaskStatus({ id, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }, [updateTaskStatus]);

  if (isLoading) return <div data-testid="loading-indicator">Загрузка задач...</div>;
  if (isError) return <div data-testid="error-message">Ошибка при загрузке задач</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div data-testid="board-page">
        {currentBoardName && (
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mt: 3,
              ml: 3,
              mb: 0,
              fontWeight: 'bold'
            }}
            data-testid="board-title"
          >
            {currentBoardName}
          </Typography>
        )}
        <Grid 
          container 
          spacing={3} 
          sx={{ p: 3, minHeight: '80vh', flexWrap: 'nowrap', overflowX: 'auto' }}
          data-testid="board-columns-container"
        >
          {STATUSES.map((status) => (
            <Grid 
              size={{ xs: 12, md: 4 }} 
              key={status}
              data-testid={`column-${status}`}
            >
              <Card 
                variant="outlined" 
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                data-testid={`card-${status}`}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      mb: 2,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      fontSize: '0.875rem',
                      letterSpacing: '0.5px',
                    }}
                    data-testid={`column-title-${status}`}
                  >
                    {COLUMN_NAMES[status]}
                  </Typography>
                  <TaskColumn 
                    status={status} 
                    tasks={statusMap[status]} 
                    onDrop={handleDrop}
                    data-testid={`task-column-${status}`}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;
