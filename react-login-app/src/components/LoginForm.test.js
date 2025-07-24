import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';

// Mock styled-components
jest.mock('styled-components', () => ({
  __esModule: true,
  default: (tag) => (props) => React.createElement(tag, props),
  css: () => '',
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  EyeOff: () => <span data-testid="eye-off-icon">EyeOff</span>,
  User: () => <span data-testid="user-icon">User</span>,
  Lock: () => <span data-testid="lock-icon">Lock</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
}));

describe('LoginForm Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  test('renders login form with all elements', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Secure Portal')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays demo credentials section', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    expect(screen.getByText('Demo Credentials')).toBeInTheDocument();
    expect(screen.getByText(/admin \/.*admin123/)).toBeInTheDocument();
    expect(screen.getByText(/user \/.*user123/)).toBeInTheDocument();
    expect(screen.getByText(/demo@example.com \/.*demo123/)).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit without filling fields
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/username or email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('validates username format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    
    // Test short username
    await user.type(usernameInput, 'ab');
    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters long/i)).toBeInTheDocument();
    });
    
    // Test invalid email
    await user.clear(usernameInput);
    await user.type(usernameInput, 'invalid-email');
    await waitFor(() => {
      expect(screen.getByText(/username can only contain letters, numbers/i)).toBeInTheDocument();
    });
  });

  test('validates password requirements', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Test short password
    await user.type(passwordInput, '123');
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    mockOnLogin.mockResolvedValue({ success: true });
    
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin123'
      });
    });
  });

  test('displays error message on login failure', async () => {
    const user = userEvent.setup();
    mockOnLogin.mockResolvedValue({ 
      success: false, 
      error: 'Invalid credentials' 
    });
    
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(usernameInput, 'invalid');
    await user.type(passwordInput, 'invalid');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('implements rate limiting after multiple failed attempts', async () => {
    const user = userEvent.setup();
    mockOnLogin.mockResolvedValue({ 
      success: false, 
      error: 'Invalid credentials' 
    });
    
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(usernameInput, 'invalid');
    await user.type(passwordInput, 'invalid');
    
    // Simulate 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await user.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    }
    
    // 6th attempt should show rate limiting message
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/too many failed attempts/i)).toBeInTheDocument();
    });
  });

  test('disables form during submission', async () => {
    const user = userEvent.setup();
    mockOnLogin.mockImplementation(() => new Promise(resolve => 
      setTimeout(() => resolve({ success: true }), 1000)
    ));
    
    render(<LoginForm onLogin={mockOnLogin} />);
    
    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);
    
    // Check loading state
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});