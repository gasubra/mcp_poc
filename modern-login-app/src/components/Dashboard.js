import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { LogOut, User, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const DashboardContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DashboardCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
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
`;

const Dashboard = ({ user }) => {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed');
    }
  }, [logout]);

  return (
    <DashboardContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <DashboardCard>
        <Header>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={20} style={{ color: '#10b981' }} />
              <span style={{ color: '#10b981', fontWeight: 600 }}>Authentication Successful</span>
            </div>
            <Title>Welcome, {user?.name || user?.username || 'User'}!</Title>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>You are securely logged in</p>
          </div>
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            Logout
          </LogoutButton>
        </Header>

        <UserInfoCard>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={24} />
            User Profile
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Username:</span>
              <strong>{user?.username || 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Email:</span>
              <strong>{user?.email || 'N/A'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Role:</span>
              <strong>{user?.role || 'User'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Login Time:</span>
              <strong>{user?.loginTime ? new Date(user.loginTime).toLocaleString() : 'N/A'}</strong>
            </div>
          </div>
        </UserInfoCard>

        <InfoGrid>
          <InfoCard>
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} />
              Security Features
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.6 }}>
              <li>✓ JWT token authentication</li>
              <li>✓ Input validation & sanitization</li>
              <li>✓ Session timeout protection</li>
              <li>✓ Encrypted communication</li>
            </ul>
          </InfoCard>
          <InfoCard>
            <h4 style={{ marginBottom: '1rem' }}>Application Features</h4>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 1.6 }}>
              <li>✓ Responsive design</li>
              <li>✓ Real-time validation</li>
              <li>✓ Accessibility compliant</li>
              <li>✓ Performance optimized</li>
            </ul>
          </InfoCard>
        </InfoGrid>
      </DashboardCard>
    </DashboardContainer>
  );
};

export default Dashboard;