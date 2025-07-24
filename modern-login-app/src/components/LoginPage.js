import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import toast from 'react-hot-toast';
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const DemoSection = styled.div`
  background: #f3f4f6;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  text-align: center;
`;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Login successful!');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Connection error');
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  return (
    <PageContainer>
      <LoginCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} style={{ color: '#6366f1', marginBottom: '1rem' }} />
          <Title>Welcome Back</Title>
          <p style={{ color: '#6b7280' }}>Sign in to your account</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="text"
              placeholder="Username or Email"
              hasError={!!errors.username}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' }
              })}
            />
            {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
          </div>

          <div style={{ position: 'relative' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              hasError={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Must be at least 6 characters' }
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing In...' : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </Form>

        <DemoSection>
          <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            Demo Credentials
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin / admin123</p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>user / user123</p>
        </DemoSection>
      </LoginCard>
    </PageContainer>
  );
};

export default LoginPage;