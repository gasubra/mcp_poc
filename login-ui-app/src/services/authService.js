/**
 * Authentication Service for TRINDAI-1112
 * 
 * Handles login, logout, and session management for the login UI application.
 * Implements username and password authentication strategy as per Epic requirements.
 */

class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.example.com';
    this.tokenKey = 'auth_token_trindai_1112';
    this.userKey = 'user_data_trindai_1112';
    
    // Demo credentials for testing the Epic implementation
    this.demoUsers = [
      { 
        username: 'admin', 
        password: 'admin123', 
        role: 'administrator', 
        name: 'System Administrator',
        email: 'admin@company.com'
      },
      { 
        username: 'user', 
        password: 'user123', 
        role: 'user', 
        name: 'Regular User',
        email: 'user@company.com'
      },
      { 
        username: 'demo@example.com', 
        password: 'demo123', 
        role: 'demo', 
        name: 'Demo User',
        email: 'demo@example.com'
      }
    ];
  }

  /**
   * Authenticate user with username and password (Epic TRINDAI-1112 requirement)
   * 
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - { success: boolean, error?: string, user?: Object }
   */
  async login(credentials) {
    try {
      const { username, password } = credentials;

      // Input validation for security
      if (!username || !password) {
        return {
          success: false,
          error: 'Username and password are required'
        };
      }

      // Basic security check for common injection attempts
      if (this.containsSuspiciousInput(username) || this.containsSuspiciousInput(password)) {
        return {
          success: false,
          error: 'Invalid characters in credentials'
        };
      }

      // Simulate realistic API delay
      await this.delay(1200);

      // Demo authentication logic - finds user by username or email
      const user = this.demoUsers.find(
        u => (u.username.toLowerCase() === username.toLowerCase() || 
              u.email.toLowerCase() === username.toLowerCase()) && 
             u.password === password
      );

      if (!user) {
        // Security: Generic error message to prevent user enumeration
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }

      // Generate secure mock JWT token
      const token = this.generateSecureToken(user);
      
      // Store authentication data securely
      this.setToken(token);
      this.setUserData({
        id: user.username,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      });

      return {
        success: true,
        user: {
          id: user.username,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication service temporarily unavailable. Please try again later.'
      };
    }
  }

  /**
   * Logout user and clear session data
   * 
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // In a real application, you would call an API to invalidate the token
      // await this.callAPI('/auth/logout', 'POST');
      
      this.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear session anyway for security
      this.clearSession();
    }
  }

  /**
   * Check if user is currently authenticated
   * 
   * @returns {Promise<boolean>}
   */
  async checkAuthStatus() {
    try {
      const token = this.getToken();
      const userData = this.getUserData();

      if (!token || !userData) {
        return false;
      }

      // Validate token integrity and expiration
      const isTokenValid = this.validateToken(token);
      
      if (!isTokenValid) {
        this.clearSession();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth status check error:', error);
      return false;
    }
  }

  /**
   * Get current authenticated user data
   * 
   * @returns {Object|null}
   */
  getCurrentUser() {
    return this.getUserData();
  }

  /**
   * Check for suspicious input patterns (basic security)
   * 
   * @param {string} input 
   * @returns {boolean}
   */
  containsSuspiciousInput(input) {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /'\s*or\s*'/i,
      /"\s*or\s*"/i,
      /union\s+select/i,
      /drop\s+table/i
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate a secure mock JWT token for demo purposes
   * 
   * @param {Object} user 
   * @returns {string}
   */
  generateSecureToken(user) {
    const header = btoa(JSON.stringify({ 
      alg: 'HS256', 
      typ: 'JWT',
      kid: 'trindai-1112' 
    }));
    
    const payload = btoa(JSON.stringify({
      sub: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 hours
      iss: 'TRINDAI-1112-Login-App',
      aud: 'login-ui-application'
    }));
    
    // In a real app, this would be a cryptographically secure signature
    const signature = btoa('trindai_1112_secure_signature_' + Date.now());
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Validate JWT token (mock implementation for demo)
   * 
   * @param {string} token 
   * @returns {boolean}
   */
  validateToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode and validate payload
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check expiration
      if (payload.exp <= currentTime) {
        return false;
      }

      // Check issuer
      if (payload.iss !== 'TRINDAI-1112-Login-App') {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Securely store authentication token
   * 
   * @param {string} token 
   */
  setToken(token) {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem(this.tokenKey, token);
      } catch (error) {
        console.error('Error storing token:', error);
      }
    }
  }

  /**
   * Retrieve authentication token
   * 
   * @returns {string|null}
   */
  getToken() {
    if (typeof Storage !== 'undefined') {
      try {
        return localStorage.getItem(this.tokenKey);
      } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Securely store user data
   * 
   * @param {Object} userData 
   */
  setUserData(userData) {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem(this.userKey, JSON.stringify(userData));
      } catch (error) {
        console.error('Error storing user data:', error);
      }
    }
  }

  /**
   * Retrieve user data
   * 
   * @returns {Object|null}
   */
  getUserData() {
    if (typeof Storage !== 'undefined') {
      try {
        const data = localStorage.getItem(this.userKey);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Clear all session data (secure logout)
   */
  clearSession() {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  }

  /**
   * Utility function to simulate API delay
   * 
   * @param {number} ms 
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get demo credentials for testing (Epic TRINDAI-1112)
   * 
   * @returns {Array}
   */
  getDemoCredentials() {
    return this.demoUsers.map(user => ({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      name: user.name
    }));
  }
}

// Export singleton instance for consistent state management
export const authService = new AuthService();
export default authService;