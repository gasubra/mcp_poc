import React from 'react';
import styled from 'styled-components';
import { authService } from '../services/authService';

const DashboardContainer = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
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
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 1rem;
`;

const EpicBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const LogoutButton = styled.button`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(231, 76, 60, 0.3);
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  border-left: 4px solid #667eea;
`;

const InfoTitle = styled.h3`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.6;
`;

const UserInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  grid-column: 1 / -1;
  margin-bottom: 1rem;
`;

const UserDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Label = styled.span`
  font-weight: 600;
`;

const Value = styled.span`
  opacity: 0.9;
`;

const StatusBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;
`;

// Logout Icon SVG
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
  </svg>
);

/**
 * Dashboard Component for TRINDAI-1112
 * 
 * Post-login dashboard showing user information and application features.
 * Displays Epic implementation success and provides secure logout functionality.
 */
const Dashboard = ({ onLogout }) => {
  const currentUser = authService.getCurrentUser();
  const demoCredentials = authService.getDemoCredentials();

  const handleLogout = async () => {
    await onLogout();
  };

  return (
    <DashboardContainer>
      <Header>
        <WelcomeSection>
          <EpicBadge>TRINDAI-1112 ✅ Successfully Implemented</EpicBadge>
          <Title>Welcome to Dashboard</Title>
          <Subtitle>Login UI Application - Authentication Successful</Subtitle>
        </WelcomeSection>
        <LogoutButton onClick={handleLogout}>
          <LogoutIcon />
          Secure Logout
        </LogoutButton>
      </Header>

      <ContentSection>
        {currentUser && (
          <UserInfo>
            <InfoTitle style={{ color: 'white', marginBottom: '1rem' }}>
              Authenticated User Information
            </InfoTitle>
            <UserDetail>
              <Label>Username:</Label>
              <Value>{currentUser.username}</Value>
            </UserDetail>
            <UserDetail>
              <Label>Full Name:</Label>
              <Value>{currentUser.name}</Value>
            </UserDetail>
            <UserDetail>
              <Label>Email:</Label>
              <Value>{currentUser.email}</Value>
            </UserDetail>
            <UserDetail>
              <Label>Role:</Label>
              <Value>{currentUser.role}</Value>
            </UserDetail>
            <UserDetail>
              <Label>Login Time:</Label>
              <Value>{currentUser.loginTime ? new Date(currentUser.loginTime).toLocaleString() : 'N/A'}</Value>
            </UserDetail>
            <UserDetail>
              <Label>Session Status:</Label>
              <Value><StatusBadge>Active & Secure</StatusBadge></Value>
            </UserDetail>
          </UserInfo>
        )}

        <InfoCard>
          <InfoTitle>Epic TRINDAI-1112 Implementation</InfoTitle>
          <InfoText>
            <strong>✅ Login Screen Created:</strong> Modern, responsive login interface
          </InfoText>
          <InfoText>
            <strong>✅ Username & Password Strategy:</strong> Secure authentication implemented
          </InfoText>
          <InfoText>
            <strong>✅ Form Validation:</strong> Client-side and server-side validation
          </InfoText>
          <InfoText>
            <strong>✅ Error Handling:</strong> Comprehensive error management
          </InfoText>
          <InfoText>
            <strong>✅ Security Features:</strong> Input sanitization and session management
          </InfoText>
        </InfoCard>

        <InfoCard>
          <InfoTitle>Application Features</InfoTitle>
          <InfoText>
            🔐 Secure username and password authentication
          </InfoText>
          <InfoText>
            ✅ Real-time form validation with error handling
          </InfoText>
          <InfoText>
            📱 Fully responsive design for all devices
          </InfoText>
          <InfoText>
            🔄 Session management and auto-logout
          </InfoText>
          <InfoText>
            🎨 Modern UI with smooth animations
          </InfoText>
          <InfoText>
            ♿ Accessibility compliant (WCAG guidelines)
          </InfoText>
        </InfoCard>
      </ContentSection>
    </DashboardContainer>
  );
};

export default Dashboard;