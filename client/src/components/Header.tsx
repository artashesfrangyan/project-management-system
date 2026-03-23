import React from 'react';
import { AppBar, Toolbar, Button, Box, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import TaskForm from './TaskForm';
import { useModal } from 'mui-modal-provider';

const Header: React.FC = () => {
  const { showModal } = useModal();

  const linkStyles = {
    marginRight: '20px',
    fontSize: '18px',
    textDecoration: 'none',
    '&.active': { color: 'red' },
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Link
          component={NavLink}
          to="/issues"
          color="inherit"
          sx={linkStyles}
        >
          Все задачи
        </Link>
        <Link
          component={NavLink}
          to="/boards"
          color="inherit"
          sx={linkStyles}
        >
          Проекты
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={() => showModal(TaskForm)} color="inherit">
          Создать задачу
        </Button>
      </Toolbar>
    </AppBar>
  );
};


export default Header;