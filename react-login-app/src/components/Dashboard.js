import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { LogOut, User, Shield, CheckCircle, Clock, Mail } from 'lucide-react';
import PropTypes from 'prop-types';

const DashboardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 900px;
  animation: fadeInUp 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const StatusBadge = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4);
  }

  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const UserInfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  grid-column: 1 / -1;
  margin-bottom: 1rem;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 5px solid #667eea;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f4;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardContent = styled.div`
  color: #666;
  line-height: 1.6;
`;

const UserDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailValue = styled.span`
  opacity: 0.9;
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  word-break: break-word;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: #555;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.div`
  color: #10b981;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

/**
 * Dashboard Component
 * 
 * Displays user information and application features after successful login
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.user - User information object
 * @param {string} [props.user.id] - User ID
 * @param {string} [props.user.username] - Username
 * @param {string} [props.user.email] - User email address
 * @param {string} [props.user.name] - User display name
 * @param {string} [props.user.role] - User role
 * @param {string} [props.user.loginTime] - ISO string of login time
 * @param {Function} props.onLogout - Logout handler function
 * 
 * @example
 * const user = {
 *   id: 'admin',
 *   username: 'admin',
 *   email: 'admin@company.com',
 *   name: 'System Administrator',
 *   role: 'Administrator',
 *   loginTime: '2024-01-15T10:30:00.000Z'
 * };
 * 
 * const handleLogout = async () => {
 *   await authService.logout();
 *   // Handle post-logout logic
 * };
 * 
 * <Dashboard user={user} onLogout={handleLogout} />
 * 
 * @features
 * - User profile information display
 * - Session status and security information
 * - Application features overview
 * - Secure logout functionality
 * - Responsive grid layout
 * - Professional card-based design
 * 
 * @accessibility
 * - Proper heading hierarchy
 * - ARIA labels for interactive elements
 * - Keyboard navigation support
 * - Screen reader friendly structure
 */
const Dashboard = memo(({ user, onLogout }) => {
  /**
   * Handle logout with error handling
   * @async
   * @function
   */
  const handleLogout = useCallback(async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show user-friendly error message
      if (process.env.NODE_ENV === 'development') {
        console.warn('Dashboard: onLogout function threw an error:', error);
      }
    }
  }, [onLogout]);

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  }, []);

  /**
   * Get display name with fallback
   * @returns {string} User display name
   */
  const getDisplayName = useCallback(() => {
    return user?.name || user?.username || 'User';
  }, [user]);

  /**
   * Get user field value with fallback
   * @param {string} field - Field name
   * @returns {string} Field value or N/A
   */
  const getUserField = useCallback((field) => {
    return user?.[field] || 'N/A';
  }, [user]);

  return (
    <DashboardContainer>
      <Header>
        <WelcomeSection>
          <StatusBadge role="status" aria-label="Authentication status">
            <CheckCircle size={16} aria-hidden="true" />
            Authentication Successful
          </StatusBadge>
          <Title>Welcome, {getDisplayName()}!</Title>
          <Subtitle>You are securely logged into your account</Subtitle>
        </WelcomeSection>
        <LogoutButton 
          onClick={handleLogout}
          aria-label="Log out of your account"
        >
          <LogOut size={18} aria-hidden="true" />
          Secure Logout
        </LogoutButton>
      </Header>

      <ContentGrid>
        <UserInfoCard>
          <CardTitle style={{ color: 'white', marginBottom: '1.5rem' }}>
            <User size={20} aria-hidden="true" />
            User Profile Information
          </CardTitle>
          
          <UserDetail>
            <DetailLabel>
              <User size={16} aria-hidden="true" />
              <span>Username</span>
            </DetailLabel>
            <DetailValue>{getUserField('username')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Mail size={16} aria-hidden="true" />
              <span>Email Address</span>
            </DetailLabel>
            <DetailValue>{getUserField('email')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Shield size={16} aria-hidden="true" />
              <span>User Role</span>
            </DetailLabel>
            <DetailValue>{getUserField('role')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Clock size={16} aria-hidden="true" />
              <span>Login Time</span>
            </DetailLabel>
            <DetailValue>{formatDate(user?.loginTime)}</DetailValue>
          </UserDetail>
        </UserInfoCard>

        <InfoCard>
          <CardTitle>
            <Shield size={20} aria-hidden="true" />
            Security Features
          </CardTitle>
          <CardContent>
            <FeatureList role="list">
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Secure JWT token authentication</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Input validation and sanitization</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Session timeout protection</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>HTTPS encrypted communication</span>
              </FeatureItem>
            </FeatureList>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardTitle>
            <CheckCircle size={20} aria-hidden="true" />
            Application Features
          </CardTitle>
          <CardContent>
            <FeatureList role="list">
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Modern responsive design</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Real-time form validation</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Accessibility compliance (WCAG 2.1)</span>
              </FeatureItem>
              <FeatureItem role="listitem">
                <FeatureIcon><CheckCircle size={16} aria-hidden="true" /></FeatureIcon>
                <span>Cross-browser compatibility</span>
              </FeatureItem>
            </FeatureList>
          </CardContent>
        </InfoCard>
      </ContentGrid>
    </DashboardContainer>
  );
});

// Component display name for debugging
Dashboard.displayName = 'Dashboard';

// PropTypes validation
Dashboard.propTypes = {
  /**
   * User information object containing profile data
   */
  user: PropTypes.shape({
    /** User unique identifier */
    id: PropTypes.string,
    /** Username for display */
    username: PropTypes.string,
    /** User email address */
    email: PropTypes.string,
    /** User full name or display name */
    name: PropTypes.string,
    /** User role or permission level */
    role: PropTypes.string,
    /** ISO string representing login timestamp */
    loginTime: PropTypes.string
  }),
  
  /**
   * Logout handler function
   * Should handle cleanup and redirect user to login
   */
  onLogout: PropTypes.func.isRequired
};

// Default props
Dashboard.defaultProps = {
  user: {
    username: 'Unknown User',
    email: 'N/A',
    name: 'Unknown User',
    role: 'User',
    loginTime: null
  }
};

export default Dashboard;