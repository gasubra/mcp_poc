class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
    this.tokenKey = 'auth_token';
    this.userKey = 'auth_user';
  }

  // Demo credentials for testing
  demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com', name: 'Admin User' },
    { username: 'user', password: 'user123', role: 'user', email: 'user@example.com', name: 'Regular User' },
    { username: 'demo@example.com', password: 'demo123', role: 'user', email: 'demo@example.com', name: 'Demo User' }
  ];

  // Simulate API delay
  delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Generate mock JWT token
  generateToken = (user) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = btoa('mock_signature');
    return `${header}.${payload}.${signature}`;
  };

  // Login method
  login = async (credentials) => {
    await this.delay(800); // Simulate network delay

    try {
      // Input validation
      if (!credentials.username || !credentials.password) {
        return { success: false, error: 'Username and password are required' };
      }

      // Check for suspicious input
      if (this.detectSuspiciousInput(credentials.username) || this.detectSuspiciousInput(credentials.password)) {
        return { success: false, error: 'Invalid characters detected' };
      }

      // Find matching demo user
      const user = this.demoCredentials.find(u => 
        (u.username === credentials.username || u.email === credentials.username) &&
        u.password === credentials.password
      );

      if (!user) {
        return { success: false, error: 'Invalid username or password' };
      }

      // Generate token and prepare user data
      const token = this.generateToken(user);
      const userData = {
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        loginTime: new Date().toISOString()
      };

      // Store in localStorage
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(userData));

      return { success: true, user: userData, token };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout method
  logout = async () => {
    await this.delay(300);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    return { success: true };
  };

  // Check authentication status
  checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem(this.tokenKey);
      const userStr = localStorage.getItem(this.userKey);

      if (!token || !userStr) {
        return { isAuthenticated: false, user: null };
      }

      // Validate token expiration
      if (this.isTokenExpired(token)) {
        await this.logout();
        return { isAuthenticated: false, user: null };
      }

      const user = JSON.parse(userStr);
      return { isAuthenticated: true, user };
    } catch (error) {
      console.error('Auth check error:', error);
      return { isAuthenticated: false, user: null };
    }
  };

  // Check if token is expired
  isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      return true; // Treat invalid tokens as expired
    }
  };

  // Detect suspicious input patterns
  detectSuspiciousInput = (input) => {
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
}

const authService = new AuthService();
export default authService;