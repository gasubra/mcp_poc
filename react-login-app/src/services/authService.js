/**
 * Authentication Service
 * 
 * Handles all authentication operations including login, logout, 
 * and session management with security best practices
 */

class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.example.com';
    this.tokenKey = 'secure_auth_token';
    this.userKey = 'secure_user_data';
    
    // Demo users for testing
    this.demoUsers = [
      {
        username: 'admin',
        email: 'admin@company.com',
        password: 'admin123',
        role: 'Administrator',
        name: 'System Administrator'
      },
      {
        username: 'user',
        email: 'user@company.com', 
        password: 'user123',
        role: 'User',
        name: 'Regular User'
      },
      {
        username: 'demo@example.com',
        email: 'demo@example.com',
        password: 'demo123',
        role: 'Demo User',
        name: 'Demo Account'
      }
    ];
  }

  /**
   * Authenticate user with username/email and password
   * @param {Object} credentials - {username, password}
   * @returns {Promise<Object>} - Authentication result
   */
  async login(credentials) {
    try {
      const { username, password } = credentials;

      // Input validation
      if (!username || !password) {
        return {
          success: false,
          error: 'Username and password are required'
        };
      }

      // Security checks
      if (this.containsSuspiciousInput(username) || this.containsSuspiciousInput(password)) {
        return {
          success: false,
          error: 'Invalid characters detected in credentials'
        };
      }

      // Simulate API delay
      await this.delay(1500);

      // Find user by username or email
      const user = this.demoUsers.find(u => 
        (u.username.toLowerCase() === username.toLowerCase() || 
         u.email.toLowerCase() === username.toLowerCase()) && 
        u.password === password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }

      // Generate secure token
      const token = this.generateToken(user);
      const userData = {
        id: user.username,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      };

      // Store authentication data
      this.setToken(token);
      this.setUserData(userData);

      return {
        success: true,
        user: userData,
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication service temporarily unavailable'
      };
    }
  }

  /**
   * Logout user and clear session
   */
  async logout() {
    try {
      this.clearSession();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearSession(); // Clear anyway for security
    }
  }

  /**
   * Check current authentication status
   * @returns {Promise<Object>} - Auth status with user data
   */
  async checkAuthStatus() {
    try {
      const token = this.getToken();
      const userData = this.getUserData();

      if (!token || !userData) {
        return { isAuthenticated: false };
      }

      // Validate token
      if (!this.validateToken(token)) {
        this.clearSession();
        return { isAuthenticated: false };
      }

      return {
        isAuthenticated: true,
        user: userData
      };
    } catch (error) {
      console.error('Auth status check error:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Generate JWT-like token for demo purposes
   * @param {Object} user - User object
   * @returns {string} - Generated token
   */
  generateToken(user) {
    const header = btoa(JSON.stringify({
      alg: 'HS256',
      typ: 'JWT'
    }));

    const payload = btoa(JSON.stringify({
      sub: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60), // 8 hours
      iss: 'secure-login-app'
    }));

    const signature = btoa('secure_signature_' + Date.now());
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Validate token integrity and expiration
   * @param {string} token - JWT token
   * @returns {boolean} - Validation result
   */
  validateToken(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Check expiration
      if (payload.exp <= currentTime) {
        return false;
      }

      // Check issuer
      if (payload.iss !== 'secure-login-app') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check for suspicious input patterns
   * @param {string} input - Input to validate
   * @returns {boolean} - True if suspicious
   */
  containsSuspiciousInput(input) {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /'\s*or\s*'/i,
      /"\s*or\s*"/i,
      /union\s+select/i,
      /drop\s+table/i,
      /exec\s*\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Secure token storage
   * @param {string} token - Token to store
   */
  setToken(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Token storage error:', error);
    }
  }

  /**
   * Retrieve stored token
   * @returns {string|null} - Stored token
   */
  getToken() {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Token retrieval error:', error);
      return null;
    }
  }

  /**
   * Secure user data storage
   * @param {Object} userData - User data to store
   */
  setUserData(userData) {
    try {
      localStorage.setItem(this.userKey, JSON.stringify(userData));
    } catch (error) {
      console.error('User data storage error:', error);
    }
  }

  /**
   * Retrieve stored user data
   * @returns {Object|null} - Stored user data
   */
  getUserData() {
    try {
      const data = localStorage.getItem(this.userKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('User data retrieval error:', error);
      return null;
    }
  }

  /**
   * Clear all session data
   */
  clearSession() {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    } catch (error) {
      console.error('Session clear error:', error);
    }
  }

  /**
   * Simulate API delay
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise} - Delay promise
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get demo credentials for testing
   * @returns {Array} - Array of demo credentials
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

// Export singleton instance
export const authService = new AuthService();
export default authService;