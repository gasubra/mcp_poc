import React from 'react';
import styled from 'styled-components';
import { LogOut, User, Shield, CheckCircle, Clock, Mail } from 'lucide-react';

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
`;

/**
 * Dashboard Component
 * 
 * Displays user information and application features after successful login
 * Features:
 * - User profile information display
 * - Session status and security information
 * - Application features overview
 * - Secure logout functionality
 */
const Dashboard = ({ user, onLogout }) => {
  const handleLogout = async () => {
    await onLogout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardContainer>
      <Header>
        <WelcomeSection>
          <StatusBadge>
            <CheckCircle size={16} />
            Authentication Successful
          </StatusBadge>
          <Title>Welcome, {user?.name || user?.username || 'User'}!</Title>
          <Subtitle>You are securely logged into your account</Subtitle>
        </WelcomeSection>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={18} />
          Secure Logout
        </LogoutButton>
      </Header>

      <ContentGrid>
        <UserInfoCard>
          <CardTitle style={{ color: 'white', marginBottom: '1.5rem' }}>
            <User size={20} />
            User Profile Information
          </CardTitle>
          
          <UserDetail>
            <DetailLabel>
              <User size={16} />
              Username
            </DetailLabel>
            <DetailValue>{user?.username || 'N/A'}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Mail size={16} />
              Email Address
            </DetailLabel>
            <DetailValue>{user?.email || 'N/A'}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Shield size={16} />
              User Role
            </DetailLabel>
            <DetailValue>{user?.role || 'User'}</DetailValue>
          </UserDetail>
          
          <UserDetail>
            <DetailLabel>
              <Clock size={16} />
              Login Time
            </DetailLabel>
            <DetailValue>{formatDate(user?.loginTime)}</DetailValue>
          </UserDetail>
        </UserInfoCard>

        <InfoCard>
          <CardTitle>
            <Shield size={20} />
            Security Features
          </CardTitle>
          <CardContent>
            <FeatureList>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Secure JWT token authentication
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Input validation and sanitization
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Session timeout protection
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                HTTPS encrypted communication
              </FeatureItem>
            </FeatureList>
          </CardContent>
        </InfoCard>

        <InfoCard>
          <CardTitle>
            <CheckCircle size={20} />
            Application Features
          </CardTitle>
          <CardContent>
            <FeatureList>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Modern responsive design
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Real-time form validation
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Accessibility compliance (WCAG 2.1)
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon><CheckCircle size={16} /></FeatureIcon>
                Cross-browser compatibility
              </FeatureItem>
            </FeatureList>
          </CardContent>
        </InfoCard>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default Dashboard;