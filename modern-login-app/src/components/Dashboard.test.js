import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { AuthProvider } from '../hooks/useAuth';
import { theme } from '../styles/theme';

const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  loginTime: '2024-01-01T12:00:00Z'
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          {component}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  test('renders dashboard with user information', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    expect(screen.getByText('Welcome, Test User!')).toBeInTheDocument();
    expect(screen.getByText('Authentication Successful')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
  });

  test('displays user profile information correctly', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  test('displays security features list', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    expect(screen.getByText('Security Features')).toBeInTheDocument();
    expect(screen.getByText('✓ JWT token authentication')).toBeInTheDocument();
    expect(screen.getByText('✓ Input validation & sanitization')).toBeInTheDocument();
  });

  test('displays application features list', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    expect(screen.getByText('Application Features')).toBeInTheDocument();
    expect(screen.getByText('✓ Responsive design')).toBeInTheDocument();
    expect(screen.getByText('✓ Real-time validation')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
  });

  test('handles missing user data gracefully', () => {
    renderWithProviders(<Dashboard user={null} />);
    
    expect(screen.getByText('Welcome, User!')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  test('formats login time correctly', () => {
    renderWithProviders(<Dashboard user={mockUser} />);
    
    // The exact format depends on locale, so just check that time is displayed
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});