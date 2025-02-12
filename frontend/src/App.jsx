import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Grid from './components/game/Grid';
import Dashboard from './components/game/Dashboard';
import NewGame from './components/game/NewGame';
import BaseLayout from './components/layout/BaseLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ImportGame from './components/game/ImportGame';

function App() {
  return (
    <Router>
      <BaseLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-game" 
            element={
              <ProtectedRoute>
                <NewGame />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game" 
            element={
              <ProtectedRoute>
                <Grid />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/import" 
            element={
              <ProtectedRoute>
                <ImportGame />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
