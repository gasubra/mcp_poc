/**
 * Input validation utilities
 */

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password.length > 128) return 'Password must be less than 128 characters';
  
  // Check for common weak passwords
  const weakPasswords = ['password', '123456', 'password123', 'admin', 'qwerty'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return 'Please choose a stronger password';
  }
  
  return true;
};

// Username validation
export const validateUsername = (username) => {
  if (!username) return 'Username is required';
  if (username.length < 3) return 'Username must be at least 3 characters long';
  if (username.length > 50) return 'Username must be less than 50 characters';
  
  // Allow letters, numbers, dots, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, dots, underscores, and hyphens';
  }
  
  return true;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Check for suspicious patterns
export const detectSuspiciousInput = (input) => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /\{\{.*\}\}/,
    /<%.*%>/,
    /\$\{.*\}/
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
};