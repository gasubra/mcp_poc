import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { AuthProvider } from '../hooks/useAuth';
import { theme } from '../styles/theme';

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

describe('LoginPage', () => {
  test('renders login form with all elements', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username or Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    renderWithProviders(<LoginPage />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays demo credentials section', () => {
    renderWithProviders(<LoginPage />);
    
    expect(screen.getByText('Demo Credentials')).toBeInTheDocument();
    expect(screen.getByText('admin / admin123')).toBeInTheDocument();
    expect(screen.getByText('user / user123')).toBeInTheDocument();
  });

  test('form validation works correctly', async () => {
    renderWithProviders(<LoginPage />);
    
    const usernameInput = screen.getByPlaceholderText('Username or Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Test short username
    fireEvent.change(usernameInput, { target: { value: 'ab' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    
    await waitFor(() => {
      expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
      expect(screen.getByText('Must be at least 6 characters')).toBeInTheDocument();
    });
  });
});