import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { LogOut, User, Shield, CheckCircle, Clock, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DashboardContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const DashboardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 1000px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LogoutButton = styled(motion.button)`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 48px;

  &:focus {
    outline: 2px solid white;
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const UserInfoCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
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
  font-size: 0.95rem;
`;

const DetailValue = styled.span`
  opacity: 0.9;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;

/**
 * Modern Dashboard Component
 * 
 * Features:
 * - User profile information display
 * - Session status and security information
 * - Application features overview
 * - Secure logout functionality
 * - Responsive grid layout
 * - Smooth animations
 * 
 * @component
 * @param {Object} props.user - User information object
 */
const Dashboard = React.memo(({ user }) => {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully. See you next time!');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  }, [logout]);

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
      return 'Invalid date';
    }
  }, []);

  const getDisplayName = useCallback(() => {
    return user?.name || user?.username || 'User';
  }, [user]);

  const getUserField = useCallback((field) => {
    return user?.[field] || 'N/A';
  }, [user]);

  return (
    <DashboardContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardCard>
        <Header>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1rem' 
            }}>
              <CheckCircle size={20} style={{ color: '#10b981' }} aria-hidden="true" />
              <span style={{ color: '#10b981', fontWeight: 600 }} role="status">
                Authentication Successful
              </span>
            </div>
            <Title>Welcome, {getDisplayName()}!</Title>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              You are securely logged into your account
            </p>
          </div>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Log out of your account"
          >
            <LogOut size={20} aria-hidden="true" />
            Secure Logout
          </LogoutButton>
        </Header>

        <UserInfoCard>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
            <User size={24} aria-hidden="true" />
            User Profile Information
          </h3>
          
          <UserDetail>
            <DetailLabel>
              <User size={18} aria-hidden="true" />
              Username
            </DetailLabel>
            <DetailValue>{getUserField('username')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Mail size={18} aria-hidden="true" />
              Email Address
            </DetailLabel>
            <DetailValue>{getUserField('email')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Shield size={18} aria-hidden="true" />
              User Role
            </DetailLabel>
            <DetailValue>{getUserField('role')}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Clock size={18} aria-hidden="true" />
              Login Time
            </DetailLabel>
            <DetailValue>{formatDate(user?.loginTime)}</DetailValue>
          </UserDetail>
        </UserInfoCard>

        <InfoGrid>
          <InfoCard>
            <h4 style={{ 
              marginBottom: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              <Shield size={20} aria-hidden="true" />
              Security Features
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.6 }}>
              <li>✓ JWT token authentication with automatic expiration</li>
              <li>✓ Real-time input validation and sanitization</li>
              <li>✓ Session timeout protection and monitoring</li>
              <li>✓ HTTPS encrypted communication</li>
            </ul>
          </InfoCard>
          
          <InfoCard>
            <h4 style={{ marginBottom: '1rem' }}>Application Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.6 }}>
              <li>✓ Modern responsive design for all devices</li>
              <li>✓ Real-time form validation with animations</li>
              <li>✓ WCAG 2.1 accessibility compliance</li>
              <li>✓ High performance with optimized rendering</li>
            </ul>
          </InfoCard>
        </InfoGrid>
      </DashboardCard>
    </DashboardContainer>
  );
});

Dashboard.displayName = 'Dashboard';

Dashboard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    loginTime: PropTypes.string
  })
};

Dashboard.defaultProps = {
  user: null
};

export default Dashboard;