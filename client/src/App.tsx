import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BoardsPage from './pages/BoardsPage';
import Header from './components/Header';
import React from 'react';
import IssuesPage from './pages/IssuesPage';
import TaskBoard from './pages/BoardPage';
import ModalProvider from 'mui-modal-provider';

const App: React.FC = () => {
  return (
    <Router basename="/project-management-system/">
      <ModalProvider>
        <Header />
        <Routes>
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="board/:id" element={<TaskBoard />} />
        </Routes>
      </ModalProvider>
    </Router>
  );
};

export default App;