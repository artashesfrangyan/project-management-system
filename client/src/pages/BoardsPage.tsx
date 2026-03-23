import React from 'react';
import { List, ListItem, ListItemText, Container, CircularProgress, Alert, Link, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useGetBoardsQuery } from '../store/services/tasks';

const linkStyles = {
  fontSize: '16px',
  textDecoration: 'none',
  '&.active': { color: 'red' },
};

const BoardsPage: React.FC = () => {
  const { data: boards, isLoading, isError } = useGetBoardsQuery();

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error">Ошибка загрузки</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <List>
        {boards?.map(({ id, name }) => (
          <ListItem key={id} divider sx={{ justifyContent: 'space-between' }}>
            <ListItemText primary={name} />
            <Link component={NavLink} to={`/board/${id}`} sx={linkStyles}>
              Перейти к доске
            </Link>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default BoardsPage;
