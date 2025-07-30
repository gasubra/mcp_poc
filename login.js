/**
 * Login Page JavaScript
 * Handles form validation, authentication, and user interactions
 */

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.loginBtn = document.getElementById('loginBtn');
        this.alertMessage = document.getElementById('alertMessage');
        this.rememberMe = document.getElementById('rememberMe');
        
        this.isLoading = false;
        this.initializeEventListeners();
        this.loadSavedCredentials();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Password toggle
        this.passwordToggle.addEventListener('click', () => this.togglePassword());
        
        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('input', () => this.validatePassword());
        
        // Social login buttons
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
        
        // Forgot password link
        document.querySelector('.forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
        
        // Sign up link
        document.querySelector('.signup-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSignUp();
        });

        // Enter key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.form.requestSubmit();
            }
        });
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isLoading) return;
        
        // Clear previous alerts
        this.hideAlert();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const remember = this.rememberMe.checked;
        
        try {
            this.setLoading(true);
            
            // Simulate authentication API call
            const result = await this.authenticateUser(email, password, remember);
            
            if (result.success) {
                this.showAlert('success', 'Login successful! Redirecting...', 'fa-check-circle');
                
                // Save credentials if remember me is checked
                if (remember) {
                    this.saveCredentials(email);
                } else {
                    this.clearSavedCredentials();
                }
                
                // Simulate redirect after successful login
                setTimeout(() => {
                    this.redirectToDashboard();
                }, 1500);
                
            } else {
                this.showAlert('error', result.message || 'Invalid email or password', 'fa-exclamation-circle');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('error', 'Login failed. Please try again.', 'fa-exclamation-triangle');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Authenticate user (mock implementation)
     */
    async authenticateUser(email, password, remember) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock authentication logic
        const validCredentials = [
            { email: 'admin@mcp.com', password: 'admin123' },
            { email: 'user@mcp.com', password: 'user123' },
            { email: 'demo@mcp.com', password: 'demo123' }
        ];
        
        const user = validCredentials.find(cred => 
            cred.email === email && cred.password === password
        );
        
        if (user) {
            // Store user session
            const userData = {
                email: user.email,
                loginTime: new Date().toISOString(),
                remember: remember
            };
            
            localStorage.setItem('mcpUser', JSON.stringify(userData));
            
            return { success: true, user: userData };
        } else {
            return { 
                success: false, 
                message: 'Invalid email or password. Try: demo@mcp.com / demo123' 
            };
        }
    }

    // ... Additional methods for validation, UI handling, etc.
    validateForm() {
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        return emailValid && passwordValid;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.setFieldError(this.emailInput, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            this.setFieldError(this.emailInput, 'Please enter a valid email address');
            return false;
        } else {
            this.setFieldSuccess(this.emailInput);
            return true;
        }
    }

    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.setFieldError(this.passwordInput, 'Password is required');
            return false;
        } else if (password.length < 6) {
            this.setFieldError(this.passwordInput, 'Password must be at least 6 characters');
            return false;
        } else {
            this.setFieldSuccess(this.passwordInput);
            return true;
        }
    }

    setFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    setFieldSuccess(field) {
        field.style.borderColor = '#10b981';
        field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        const icon = this.passwordToggle.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.loginBtn.classList.toggle('loading', loading);
        this.loginBtn.disabled = loading;
    }

    showAlert(type, message, icon = '') {
        this.alertMessage.className = `alert ${type}`;
        this.alertMessage.style.display = 'flex';
        
        const iconElement = this.alertMessage.querySelector('.alert-icon');
        const textElement = this.alertMessage.querySelector('.alert-text');
        
        iconElement.className = `alert-icon fas ${icon}`;
        textElement.textContent = message;
    }

    hideAlert() {
        this.alertMessage.style.display = 'none';
    }

    handleSocialLogin(event) {
        const button = event.currentTarget;
        const provider = button.classList.contains('google-btn') ? 'Google' : 'GitHub';
        this.showAlert('warning', `${provider} login coming soon!`, 'fa-info-circle');
    }

    handleForgotPassword() {
        this.showAlert('info', 'Password reset functionality coming soon!', 'fa-envelope');
    }

    handleSignUp() {
        this.showAlert('info', 'Sign up functionality coming soon!', 'fa-user-plus');
    }

    saveCredentials(email) {
        try {
            localStorage.setItem('mcpRememberEmail', email);
        } catch (error) {
            console.warn('Could not save credentials:', error);
        }
    }

    loadSavedCredentials() {
        try {
            const savedEmail = localStorage.getItem('mcpRememberEmail');
            if (savedEmail) {
                this.emailInput.value = savedEmail;
                this.rememberMe.checked = true;
                this.passwordInput.focus();
            }
        } catch (error) {
            console.warn('Could not load saved credentials:', error);
        }
    }

    clearSavedCredentials() {
        try {
            localStorage.removeItem('mcpRememberEmail');
        } catch (error) {
            console.warn('Could not clear saved credentials:', error);
        }
    }

    redirectToDashboard() {
        this.showAlert('success', 'Welcome to MCP Portal! 🎉', 'fa-home');
        console.log('Redirecting to dashboard...');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loginManager = new LoginManager();
    
    console.log('🚀 MCP Login Demo');
    console.log('Try these credentials:');
    console.log('• admin@mcp.com / admin123');
    console.log('• demo@mcp.com / demo123');
    console.log('• user@mcp.com / user123');
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoginManager };
}