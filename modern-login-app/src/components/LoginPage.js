import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { Eye, EyeOff, User, Lock, Shield, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 52px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid white;
    outline-offset: 3px;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DemoSection = styled.div`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }

  &:focus {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Modern Login Page Component with enhanced security and accessibility
 * 
 * Features:
 * - Advanced form validation with React Hook Form
 * - Smooth animations with Framer Motion
 * - Password visibility toggle with accessibility
 * - Toast notifications for user feedback
 * - Responsive design for all devices
 * - WCAG 2.1 accessibility compliance
 * - Demo credentials for testing
 * 
 * @component
 */
const LoginPage = React.memo(() => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = useCallback(async (data) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const sanitizedData = {
        username: data.username.trim(),
        password: data.password
      };
      
      const result = await login(sanitizedData);
      if (result.success) {
        toast.success('Login successful! Welcome back.');
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Connection error. Please check your internet and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [login, isLoading]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const isFormValid = isValid && watchedFields.username && watchedFields.password;

  return (
    <PageContainer>
      <LoginCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} style={{ color: '#6366f1', marginBottom: '1rem' }} aria-hidden="true" />
          <Title>Welcome Back</Title>
          <p style={{ color: '#6b7280' }}>Sign in to your secure account</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Input
              id="username"
              type="text"
              placeholder="Username or Email"
              hasError={!!errors.username}
              autoComplete="username"
              aria-invalid={errors.username ? 'true' : 'false'}
              aria-describedby={errors.username ? 'username-error' : undefined}
              disabled={isLoading}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' },
                validate: value => {
                  if (value.includes('@')) {
                    return validateEmail(value) || 'Please enter a valid email address';
                  }
                  return value.match(/^[a-zA-Z0-9._-]+$/) || 'Username can only contain letters, numbers, dots, underscores, and hyphens';
                }
              })}
            />
            {errors.username && (
              <ErrorMessage id="username-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                {errors.username.message}
              </ErrorMessage>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              hasError={!!errors.password}
              autoComplete="current-password"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : 'password-toggle'}
              disabled={isLoading}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' },
                validate: validatePassword
              })}
            />
            <ToggleButton
              type="button"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              id="password-toggle"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </ToggleButton>
            {errors.password && (
              <ErrorMessage id="password-error" role="alert">
                <AlertCircle size={16} aria-hidden="true" />
                {errors.password.message}
              </ErrorMessage>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            whileHover={!isLoading && isFormValid ? { scale: 1.02 } : {}}
            whileTap={!isLoading && isFormValid ? { scale: 0.98 } : {}}
            aria-label={isLoading ? 'Signing in...' : 'Sign in to your account'}
          >
            {isLoading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} aria-hidden="true" />
              </>
            )}
          </Button>
        </Form>

        <DemoSection>
          <h4 style={{ 
            marginBottom: '0.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem' 
          }}>
            <Sparkles size={16} aria-hidden="true" />
            Demo Credentials
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            <strong>Admin:</strong> admin / admin123
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>User:</strong> user / user123
          </p>
        </DemoSection>
      </LoginCard>
    </PageContainer>
  );
});

LoginPage.displayName = 'LoginPage';

LoginPage.propTypes = {
  // No props expected for this component
};

export default LoginPage;