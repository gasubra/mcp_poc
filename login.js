// Login Page JavaScript - Enhanced with modern features
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
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadRememberedEmail();
        this.setupFormValidation();
        this.setupPasswordToggle();
        this.setupSocialLogins();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input event listeners for real-time validation
        this.emailInput.addEventListener('input', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        
        // Password toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePassword());
        
        // Remember me functionality
        this.rememberCheckbox.addEventListener('change', () => this.handleRememberMe());
        
        // Enter key support
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.passwordInput.focus();
        });
        
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.form.dispatchEvent(new Event('submit'));
        });
    }
    
    setupFormValidation() {
        // Add input validation styling
        [this.emailInput, this.passwordInput].forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('focus', () => this.clearFieldError(input));
        });
    }
    
    setupPasswordToggle() {
        this.togglePasswordBtn.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = this.togglePasswordBtn.querySelector('i');
            icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }
    
    setupSocialLogins() {
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const provider = btn.classList.contains('google-btn') ? 'Google' : 'GitHub';
                this.handleSocialLogin(provider);
            });
        });
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.setFieldError(this.emailInput, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.setFieldError(this.emailInput, 'Please enter a valid email');
            return false;
        }
        
        this.clearFieldError(this.emailInput);
        return true;
    }
    
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.setFieldError(this.passwordInput, 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.setFieldError(this.passwordInput, 'Password must be at least 6 characters');
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
    
    setFieldError(input, message) {
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Remove existing error message
        const existingError = input.parentNode.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
        errorDiv.textContent = message;
        input.parentNode.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(input) {
        input.style.borderColor = '#e5e7eb';
        input.style.boxShadow = 'none';
        
        const errorMessage = input.parentNode.parentNode.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
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
            // Simulate API call
            const result = await this.authenticateUser({
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value,
                remember: this.rememberCheckbox.checked
            });
            
            if (result.success) {
                this.showAlert('Login successful! Redirecting...', 'success');
                
                // Handle remember me
                if (this.rememberCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', this.emailInput.value.trim());
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Simulate redirect after success
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    // window.location.href = '/dashboard';
                }, 1500);
            } else {
                throw new Error(result.message || 'Authentication failed');
            }
            
        } catch (error) {
            this.showAlert(error.message || 'Login failed. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async authenticateUser(credentials) {
        // Simulate API call with random delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Demo credentials for testing
        const demoCredentials = {
            email: 'demo@example.com',
            password: 'demo123'
        };
        
        // Simulate different scenarios
        const random = Math.random();
        
        if (credentials.email === demoCredentials.email && credentials.password === demoCredentials.password) {
            return { success: true, user: { email: credentials.email } };
        } else if (random < 0.1) {
            throw new Error('Network error. Please check your connection.');
        } else if (random < 0.2) {
            throw new Error('Invalid email or password.');
        } else {
            // For demo purposes, accept any valid email format
            return { success: true, user: { email: credentials.email } };
        }
    }
    
    handleSocialLogin(provider) {
        this.showAlert(`${provider} login will be implemented soon`, 'info');
        
        // Simulate social login process
        console.log(`Initiating ${provider} OAuth flow...`);
        
        // In a real app, you would redirect to the OAuth provider
        // window.location.href = `/auth/${provider.toLowerCase()}`;
    }
    
    setLoadingState(isLoading) {
        this.loginBtn.classList.toggle('loading', isLoading);
        this.loginBtn.disabled = isLoading;
        
        // Disable form inputs during loading
        [this.emailInput, this.passwordInput].forEach(input => {
            input.disabled = isLoading;
        });
    }
    
    showAlert(message, type = 'info') {
        this.alert.className = `alert ${type}`;
        this.alert.querySelector('.alert-message').textContent = message;
        
        // Set appropriate icon
        const icon = this.alert.querySelector('.alert-icon');
        switch (type) {
            case 'success':
                icon.className = 'alert-icon fas fa-check-circle';
                break;
            case 'error':
                icon.className = 'alert-icon fas fa-exclamation-circle';
                break;
            case 'info':
            default:
                icon.className = 'alert-icon fas fa-info-circle';
                break;
        }
        
        // Show alert
        this.alert.classList.add('show');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.alert.classList.remove('show');
        }, 5000);
    }
    
    loadRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            this.emailInput.value = rememberedEmail;
            this.rememberCheckbox.checked = true;
            this.passwordInput.focus();
        }
    }
    
    handleRememberMe() {
        if (!this.rememberCheckbox.checked) {
            localStorage.removeItem('rememberedEmail');
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