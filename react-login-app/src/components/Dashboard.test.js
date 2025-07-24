import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Dashboard from './Dashboard';

// Mock styled-components
jest.mock('styled-components', () => ({
  __esModule: true,
  default: (tag) => (props) => React.createElement(tag, props),
  css: () => '',
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  LogOut: () => <span data-testid="logout-icon">LogOut</span>,
  User: () => <span data-testid="user-icon">User</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  CheckCircle: () => <span data-testid="check-icon">CheckCircle</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
}));

describe('Dashboard Component', () => {
  const mockOnLogout = jest.fn();
  const mockUser = {
    id: 'admin',
    username: 'admin',
    email: 'admin@company.com',
    name: 'System Administrator',
    role: 'Administrator',
    loginTime: '2024-01-15T10:30:00.000Z'
  };

  beforeEach(() => {
    mockOnLogout.mockClear();
  });

  test('renders dashboard with user information', () => {
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, System Administrator!')).toBeInTheDocument();
    expect(screen.getByText('Authentication Successful')).toBeInTheDocument();
    expect(screen.getByText('You are securely logged into your account')).toBeInTheDocument();
  });

  test('displays user profile information correctly', () => {
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('User Profile Information')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('admin@company.com')).toBeInTheDocument();
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  test('formats login time correctly', () => {
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    // Check that login time is displayed (exact format may vary by locale)
    const loginTimeElement = screen.getByText(/1\/15\/2024|15\/1\/2024|2024/);
    expect(loginTimeElement).toBeInTheDocument();
  });

  test('handles missing user data gracefully', () => {
    const incompleteUser = {
      username: 'testuser'
      // Missing other fields
    };
    
    render(<Dashboard user={incompleteUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // For missing email
  });

  test('displays security features list', () => {
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Security Features')).toBeInTheDocument();
    expect(screen.getByText('Secure JWT token authentication')).toBeInTheDocument();
    expect(screen.getByText('Input validation and sanitization')).toBeInTheDocument();
    expect(screen.getByText('Session timeout protection')).toBeInTheDocument();
    expect(screen.getByText('HTTPS encrypted communication')).toBeInTheDocument();
  });

  test('displays application features list', () => {
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Application Features')).toBeInTheDocument();
    expect(screen.getByText('Modern responsive design')).toBeInTheDocument();
    expect(screen.getByText('Real-time form validation')).toBeInTheDocument();
    expect(screen.getByText('Accessibility compliance (WCAG 2.1)')).toBeInTheDocument();
    expect(screen.getByText('Cross-browser compatibility')).toBeInTheDocument();
  });

  test('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /secure logout/i });
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('handles logout errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnLogout.mockRejectedValue(new Error('Logout failed'));
    
    render(<Dashboard user={mockUser} onLogout={mockOnLogout} />);
    
    const logoutButton = screen.getByRole('button', { name: /secure logout/i });
    await user.click(logoutButton);
    
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    
    consoleErrorSpy.mockRestore();
  });

  test('renders with minimal user data', () => {
    const minimalUser = { username: 'user' };
    
    render(<Dashboard user={minimalUser} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, user!')).toBeInTheDocument();
    // Should handle missing fields gracefully
    expect(screen.getAllByText('N/A')).toHaveLength(3); // email, role, loginTime
  });

  test('uses fallback display name when name is not provided', () => {
    const userWithoutName = {
      username: 'testuser',
      email: 'test@example.com'
    };
    
    render(<Dashboard user={userWithoutName} onLogout={mockOnLogout} />);
    
    expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
  });
});