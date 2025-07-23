import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { authService } from './services/authService';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: white;
  font-size: 1.2rem;
`;

/**
 * Main Application Component for TRINDAI-1112
 * 
 * Implements the login UI application with username and password authentication strategy.
 * Features:
 * - Protected routing
 * - Authentication state management
 * - Session persistence
 * - Error handling
 */
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const checkAuthStatus = async () => {
      try {
        const authStatus = await authService.checkAuthStatus();
        setIsAuthenticated(authStatus);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <div>Loading Login Application...</div>
      </LoadingContainer>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
                <LoginPage onLogin={handleLogin} /> : 
                <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
                <Dashboard onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;