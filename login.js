// Login Page JavaScript - Enhanced with modern features
/**
 * Enhanced Login Manager with security improvements and better error handling
 * @author Development Team
 * @version 1.1.0
 */

// Security utility functions
const SecurityUtils = {
    /**
     * Sanitize input to prevent XSS attacks
     * @param {string} input - Raw input string
     * @returns {string} Sanitized string
     */
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    /**
     * Generate a simple CSRF token for form submission
     * @returns {string} CSRF token
     */
    generateCSRFToken() {
        return 'csrf-' + Math.random().toString(36).substr(2, 9) + Date.now();
    },
    
    /**
     * Rate limiting for login attempts
     */
    loginAttempts: new Map(),
    
    /**
     * Check if rate limiting should be applied
     * @param {string} identifier - User identifier (email)
     * @returns {boolean} Whether request should be rate limited
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const attempts = this.loginAttempts.get(identifier) || [];
        const recentAttempts = attempts.filter(time => now - time < 15 * 60 * 1000); // 15 minutes
        
        if (recentAttempts.length >= 5) {
            return true; // Rate limited
        }
        
        recentAttempts.push(now);
        this.loginAttempts.set(identifier, recentAttempts);
        return false;
    }
};

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.spinner = document.getElementById('spinner');
        this.alert = document.getElementById('alert');
        this.rememberCheckbox = document.getElementById('remember');
        
        // Security enhancements
        this.csrfToken = SecurityUtils.generateCSRFToken();
        this.maxRetries = 3;
        this.retryCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadRememberedEmail();
        this.setupFormValidation();
        this.setupPasswordToggle();
        this.setupSocialLogins();
        this.setupSecurityFeatures();
    }
    
    /**
     * Enhanced security features setup
     */
    setupSecurityFeatures() {
        // Add CSRF token to form
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = this.csrfToken;
        this.form.appendChild(csrfInput);
        
        // Prevent form auto-completion for sensitive data
        this.passwordInput.setAttribute('autocomplete', 'current-password');
        this.emailInput.setAttribute('autocomplete', 'username');
        
        // Add form validation attributes
        this.emailInput.setAttribute('spellcheck', 'false');
        this.passwordInput.setAttribute('spellcheck', 'false');
    }
    
    setupEventListeners() {
        // Form submission with enhanced error handling
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input event listeners for real-time validation with debouncing
        this.emailInput.addEventListener('input', this.debounce(() => this.validateEmail(), 300));
        this.passwordInput.addEventListener('input', this.debounce(() => this.validatePassword(), 300));
        
        // Password toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePassword());
        
        // Remember me functionality
        this.rememberCheckbox.addEventListener('change', () => this.handleRememberMe());
        
        // Enhanced keyboard navigation
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.passwordInput.focus();
            }
        });
        
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
        
        // Focus management for accessibility
        this.setupFocusManagement();
    }
    
    /**
     * Debounce utility function for performance optimization
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Enhanced focus management for accessibility
     */
    setupFocusManagement() {
        // Trap focus within the login card
        const focusableElements = this.form.querySelectorAll(
            'input:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    setupFormValidation() {
        // Enhanced validation with better error handling
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('focus', () => this.clearFieldError(input));
            
            // Add input sanitization
            input.addEventListener('input', (e) => {
                e.target.value = SecurityUtils.sanitizeInput(e.target.value);
            });
        });
    }
    
    setupPasswordToggle() {
        this.togglePasswordBtn.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = this.togglePasswordBtn.querySelector('i');
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            
            // Update ARIA label for screen readers
            this.togglePasswordBtn.setAttribute('aria-label', 
                isPassword ? 'Hide password' : 'Show password'
            );
        });
    }
    
    setupSocialLogins() {
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = btn.classList.contains('google-btn') ? 'Google' : 'GitHub';
                this.handleSocialLogin(provider);
            });
        });
    }
    
    /**
     * Enhanced email validation with better regex and internationalization support
     */
    validateEmail() {
        const email = this.emailInput.value.trim();
        // More comprehensive email regex that supports international domains
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!email) {
            this.setFieldError(this.emailInput, 'Email address is required');
            return false;
        }
        
        if (email.length > 254) {
            this.setFieldError(this.emailInput, 'Email address is too long');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.setFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(this.emailInput);
        return true;
    }
    
    /**
     * Enhanced password validation with security requirements
     */
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.setFieldError(this.passwordInput, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            this.setFieldError(this.passwordInput, 'Password must be at least 8 characters long');
            return false;
        }
        
        if (password.length > 128) {
            this.setFieldError(this.passwordInput, 'Password is too long (max 128 characters)');
            return false;
        }
        
        // Check for common weak passwords
        const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
        if (weakPasswords.includes(password.toLowerCase())) {
            this.setFieldError(this.passwordInput, 'Please choose a stronger password');
            return false;
        }
        
        this.clearFieldError(this.passwordInput);
        return true;
    }
    
    validateField(input) {
        if (input === this.emailInput) {
            return this.validateEmail();
        } else if (input === this.passwordInput) {
            return this.validatePassword();
        }
        return true;
    }
    
    /**
     * Enhanced error display with better accessibility
     */
    setFieldError(input, message) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        input.setAttribute('aria-invalid', 'true');
        
        // Remove existing error message
        const existingError = input.parentNode.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message with proper accessibility
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = `${input.id}-error`;
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'polite');
        errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
        errorDiv.textContent = message;
        input.parentNode.parentNode.appendChild(errorDiv);
        
        // Update aria-describedby
        input.setAttribute('aria-describedby', `${input.id}-error`);
    }
    
    clearFieldError(input) {
        input.style.borderColor = '#e5e7eb';
        input.style.boxShadow = 'none';
        input.setAttribute('aria-invalid', 'false');
        input.removeAttribute('aria-describedby');
        
        const errorMessage = input.parentNode.parentNode.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }
    
    /**
     * Enhanced form submission with better error handling and security
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Check rate limiting
        const email = this.emailInput.value.trim();
        if (SecurityUtils.checkRateLimit(email)) {
            this.showAlert('Too many login attempts. Please try again in 15 minutes.', 'error');
            return;
        }
        
        // Validate all fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showAlert('Please fix the errors above', 'error');
            return;
        }
        
        // Start loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call with retry logic
            const result = await this.authenticateUserWithRetry({
                email: email,
                password: this.passwordInput.value,
                remember: this.rememberCheckbox.checked,
                _token: this.csrfToken
            });
            
            if (result.success) {
                this.showAlert('Login successful! Redirecting...', 'success');
                
                // Handle remember me with secure storage
                if (this.rememberCheckbox.checked) {
                    // Only store email, never store password
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Reset retry count on success
                this.retryCount = 0;
                
                // Simulate redirect after success
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // In production: window.location.href = '/dashboard';
                }, 1500);
            } else {
                throw new Error(result.message || 'Authentication failed');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    /**
     * Authentication with retry logic and better error handling
     */
    async authenticateUserWithRetry(credentials) {
        const maxRetries = 3;
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.authenticateUser(credentials);
            } catch (error) {
                lastError = error;
                
                if (error.message.includes('Network') && attempt < maxRetries) {
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
                    continue;
                }
                
                throw error;
            }
        }
        
        throw lastError;
    }
    
    async authenticateUser(credentials) {
        // Simulate API call with more realistic timing
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        
        // Demo credentials for testing
        const demoCredentials = {
            email: 'demo@example.com',
            password: 'demo123'
        };
        
        // Simulate different scenarios with better error messages
        const random = Math.random();
        
        if (credentials.email === demoCredentials.email && credentials.password === demoCredentials.password) {
            return { success: true, user: { email: credentials.email, name: 'Demo User' } };
        } else if (random < 0.05) {
            throw new Error('Network error. Please check your internet connection and try again.');
        } else if (random < 0.1) {
            throw new Error('Server is temporarily unavailable. Please try again in a few moments.');
        } else if (random < 0.15) {
            throw new Error('Invalid email address or password. Please check your credentials.');
        } else {
            // For demo purposes, accept any valid email format
            return { 
                success: true, 
                user: { 
                    email: credentials.email, 
                    name: credentials.email.split('@')[0] 
                } 
            };
        }
    }
    
    handleSocialLogin(provider) {
        // Add loading state for social login
        const socialBtn = document.querySelector(`.${provider.toLowerCase()}-btn`);
        const originalText = socialBtn.innerHTML;
        
        socialBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        socialBtn.disabled = true;
        
        // Simulate OAuth redirect delay
        setTimeout(() => {
            this.showAlert(`${provider} OAuth integration will be available soon`, 'info');
            socialBtn.innerHTML = originalText;
            socialBtn.disabled = false;
        }, 1500);
        
        // In production, this would redirect to OAuth provider
        console.log(`Initiating ${provider} OAuth flow...`);
    }
    
    setLoadingState(isLoading) {
        this.loginBtn.classList.toggle('loading', isLoading);
        this.loginBtn.disabled = isLoading;
        
        // Disable form inputs during loading to prevent multiple submissions
        [this.emailInput, this.passwordInput, this.rememberCheckbox].forEach(input => {
            input.disabled = isLoading;
        });
        
        // Disable social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.disabled = isLoading;
        });
    }
    
    /**
     * Enhanced alert system with better accessibility
     */
    showAlert(message, type = 'info') {
        this.alert.className = `alert ${type}`;
        this.alert.querySelector('.alert-message').textContent = message;
        this.alert.setAttribute('role', 'alert');
        this.alert.setAttribute('aria-live', 'assertive');
        
        // Set appropriate icon
        const icon = this.alert.querySelector('.alert-icon');
        switch (type) {
            case 'success':
                icon.className = 'alert-icon fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'alert-icon fas fa-exclamation-circle';
                break;
            case 'warning':
                icon.className = 'alert-icon fas fa-exclamation-triangle';
                break;
            case 'info':
            default:
                icon.className = 'alert-icon fas fa-info-circle';
                break;
        }
        
        // Show alert with focus management
        this.alert.classList.add('show');
        
        // Auto-hide after appropriate time based on message length
        const hideDelay = Math.max(3000, message.length * 50);
        setTimeout(() => {
            this.alert.classList.remove('show');
        }, hideDelay);
    }
    
    loadRememberedEmail() {
        try {
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail && this.validateEmailFormat(rememberedEmail)) {
                this.emailInput.value = rememberedEmail;
                this.rememberCheckbox.checked = true;
                this.passwordInput.focus();
            }
        } catch (error) {
            console.warn('Failed to load remembered email:', error);
            // Clear potentially corrupted data
            localStorage.removeItem('rememberedEmail');
        }
    }
    
    /**
     * Helper method to validate email format without showing errors
     */
    validateEmailFormat(email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    handleRememberMe() {
        if (!this.rememberCheckbox.checked) {
            try {
                localStorage.removeItem('rememberedEmail');
            } catch (error) {
                console.warn('Failed to remove remembered email:', error);
            }
        }
    }
}

// Enhanced features and utilities
class UIEnhancements {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupAccessibility();
        this.setupAnimations();
    }
    
    setupKeyboardNavigation() {
        // Tab navigation improvements
        const focusableElements = document.querySelectorAll(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach((element, index) => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    // Custom tab behavior if needed
                }
            });
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and roles
        const form = document.getElementById('loginForm');
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', 'Login form');
        
        // Enhanced error announcements
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        [emailInput, passwordInput].forEach(input => {
            input.setAttribute('aria-describedby', `${input.id}-error`);
        });
    }
    
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.form-group').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginManager = new LoginManager();
    const uiEnhancements = new UIEnhancements();
    
    // Development helpers
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🚀 Login page loaded in development mode');
        console.log('💡 Demo credentials: demo@example.com / demo123');
        
        // Add demo credentials button in development
        const demoBtn = document.createElement('button');
        demoBtn.type = 'button';
        demoBtn.textContent = 'Fill Demo Credentials';
        demoBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 8px 16px;
            background: #10b981;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
        `;
        demoBtn.addEventListener('click', () => {
            document.getElementById('email').value = 'demo@example.com';
            document.getElementById('password').value = 'demo123';
        });
        document.body.appendChild(demoBtn);
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoginManager, UIEnhancements };
}