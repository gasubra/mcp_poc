/**
 * Entry Point for TRINDAI-1112 Login UI Application
 * 
 * Initializes the React application with proper error handling,
 * performance monitoring, and development tools.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Error handling for production builds
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('TRINDAI-1112 App Error:', error, errorInfo);
    this.setState({ errorInfo });

    // In a real application, you would send this error to a logging service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🚨 Application Error
          </h1>
          <p style={{ fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            The TRINDAI-1112 Login Application encountered an unexpected error.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid white',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            🔄 Reload Application
          </button>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ marginTop: '2rem', color: '#ffeb3b' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                🔧 Development Error Details
              </summary>
              <pre style={{ 
                background: 'rgba(0, 0, 0, 0.3)', 
                padding: '1rem', 
                borderRadius: '5px',
                fontSize: '0.8rem',
                overflow: 'auto',
                maxWidth: '800px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root element and render the application
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found. Please ensure your HTML file includes a div with id="root".');
}

const root = ReactDOM.createRoot(container);

// Performance monitoring (development only)
if (process.env.NODE_ENV === 'development') {
  // Performance observer for monitoring render times
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('react')) {
        console.log(`🎯 TRINDAI-1112 Performance: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
      }
    }
  });
  
  if ('observe' in observer) {
    observer.observe({ entryTypes: ['measure'] });
  }
}

// Render the application with error boundary and strict mode
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker registration for offline capability (optional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ TRINDAI-1112: Service Worker registered successfully:', registration.scope);
      })
      .catch((error) => {
        console.log('❌ TRINDAI-1112: Service Worker registration failed:', error);
      });
  });
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 TRINDAI-1112: Unhandled promise rejection:', event.reason);
  
  // Prevent the default browser error handling
  event.preventDefault();
  
  // In a real application, you would send this to a logging service
  // Example: errorReportingService.captureException(event.reason);
});

// Console banner for development
if (process.env.NODE_ENV === 'development') {
  console.log(`
  🎯 TRINDAI-1112 Login UI Application
  =====================================
  ✅ Epic: Create UI application for login screen
  ✅ Strategy: Username and password authentication
  ✅ Framework: React 18 with modern architecture
  ✅ Status: Successfully initialized
  
  📝 Demo Credentials Available:
  • admin / admin123 (Administrator)
  • user / user123 (Regular User)
  • demo@example.com / demo123 (Demo User)
  `);
}