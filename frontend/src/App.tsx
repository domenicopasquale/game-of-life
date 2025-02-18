import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/game/Dashboard';
import NewGame from './components/game/NewGame';
import BaseLayout from './components/layout/BaseLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ImportGame from './components/game/ImportGame';
import ErrorBoundary from './components/ErrorBoundary';
import GridWrapper from './components/game/GridWrapper';
import { useEffect, useState } from 'react';
import client from './utils/apolloClient';
import Spinner from './components/common/Spinner';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await client.resetStore();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return <Spinner fullScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar with highest z-index */}
      <nav className="sticky top-0 z-[100] bg-white dark:bg-gray-800 shadow-sm">
        {/* ... navbar content ... */}
      </nav>

      <ErrorBoundary>
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
                    <GridWrapper />
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
      </ErrorBoundary>
    </div>
  );
}

export default App; 