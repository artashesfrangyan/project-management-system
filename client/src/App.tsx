import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import React, { Suspense, lazy } from 'react';
import ModalProvider from 'mui-modal-provider';
import { CircularProgress, Box } from '@mui/material';

const BoardsPage = lazy(() => import('./pages/BoardsPage'));
const IssuesPage = lazy(() => import('./pages/IssuesPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <Router basename="/project-management-system">
      <ModalProvider>
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Navigate to="/boards" replace />} />
            
            <Route path="/boards" element={<BoardsPage />} />
            <Route path="/issues" element={<IssuesPage />} />
            <Route path="/board/:id" element={<BoardPage />} />
          </Routes>
        </Suspense>
      </ModalProvider>
    </Router>
  );
};

export default App;