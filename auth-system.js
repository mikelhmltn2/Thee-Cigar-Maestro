/**
 * Advanced Authentication System for Thee Cigar Maestro
 * Frontend authentication with JWT, social login, 2FA, and session management
 */

class AuthenticationSystem {
  constructor() {
    this.apiBaseUrl = 'https://api.theecigarmaestro.com'; // API endpoint (currently not implemented)
    this.fallbackMode = true; // Enable fallback for missing API
    this.offlineMode = false; // Track if we're operating offline
    this.currentUser = null;
    this.authToken = null;
    this.refreshToken = null;
    this.authListeners = new Set();
    this.socialProviders = ['google', 'facebook'];
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize authentication system
   */
  async init() {
    try {
      await this.loadStoredAuth();
      this.setupAuthUI();
      this.setupEventListeners();
      this.setupTokenRefresh();
      
      this.isInitialized = true;
      console.log('🔐 Authentication System initialized');
      
      if (this.authToken) {
        await this.validateToken();
      }
      
    } catch (_error) {
      console.error('❌ Authentication initialization failed:', error);
    }
  }

  /**
   * Load stored authentication data
   */
  async loadStoredAuth() {
    try {
      if (window.storageManager) {
        const sessionData = window.storageManager.getSessionData();
        this.authToken = sessionData.authToken;
        this.refreshToken = sessionData.refreshToken;
        this.currentUser = sessionData.currentUser;
      } else {
        // Fallback to localStorage
        this.authToken = localStorage.getItem('auth_token');
        this.refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('current_user');
        this.currentUser = userData ? JSON.parse(userData) : null;
      }
    } catch (_error) {
      console.error('Error loading stored auth:', error);
    }
  }

  /**
   * Save authentication data
   */
  saveAuthData() {
    try {
      if (window.storageManager) {
        const sessionData = window.storageManager.getSessionData();
        sessionData.authToken = this.authToken;
        sessionData.refreshToken = this.refreshToken;
        sessionData.currentUser = this.currentUser;
        window.storageManager.saveData();
      } else {
        // Fallback to localStorage
        if (this.authToken) {
          localStorage.setItem('auth_token', this.authToken);
        } else {
          localStorage.removeItem('auth_token');
        }
        
        if (this.refreshToken) {
          localStorage.setItem('refresh_token', this.refreshToken);
        } else {
          localStorage.removeItem('refresh_token');
        }
        
        if (this.currentUser) {
          localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        } else {
          localStorage.removeItem('current_user');
        }
      }
    } catch (_error) {
      console.error('Error saving auth data:', error);
    }
  }

  /**
   * Setup authentication UI components
   */
  setupAuthUI() {
    // Create authentication modal
    const authModalHTML = `
      <div id="authModal" class="auth-modal" style="display: none;">
        <div class="auth-modal-content">
          <div class="auth-header">
            <h2 id="authTitle">Welcome to Thee Cigar Maestro</h2>
            <button class="auth-close" onclick="authSystem.closeAuthModal()">&times;</button>
          </div>
          
          <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">Sign In</button>
            <button class="auth-tab" data-tab="register">Create Account</button>
          </div>
          
          <!-- Login Form -->
          <div id="loginForm" class="auth-form active">
            <form onsubmit="authSystem.handleLogin(event)">
              <div class="form-group">
                <label for="loginEmail">Email</label>
                <input type="email" id="loginEmail" required>
              </div>
              <div class="form-group">
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" required>
                <button type="button" class="password-toggle" onclick="authSystem.togglePassword('loginPassword')">👁️</button>
              </div>
              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" id="rememberMe">
                  <span class="checkmark"></span>
                  Remember me
                </label>
                <a href="#" onclick="authSystem.showForgotPassword()">Forgot password?</a>
              </div>
              <button type="submit" class="auth-btn primary">Sign In</button>
            </form>
            
            <div class="auth-divider">
              <span>or continue with</span>
            </div>
            
            <div class="social-auth">
              <button class="social-btn google" onclick="authSystem.socialLogin('google')">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button class="social-btn facebook" onclick="authSystem.socialLogin('facebook')">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>
          </div>
          
          <!-- Register Form -->
          <div id="registerForm" class="auth-form">
            <form onsubmit="authSystem.handleRegister(event)">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" required>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" required>
                </div>
              </div>
              <div class="form-group">
                <label for="registerEmail">Email</label>
                <input type="email" id="registerEmail" required>
              </div>
              <div class="form-group">
                <label for="registerPassword">Password</label>
                <input type="password" id="registerPassword" required>
                <button type="button" class="password-toggle" onclick="authSystem.togglePassword('registerPassword')">👁️</button>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill"></div>
                  </div>
                  <div class="strength-text">Password strength</div>
                </div>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" required>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="agreeTerms" required>
                  <span class="checkmark"></span>
                  I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" class="auth-btn primary">Create Account</button>
            </form>
          </div>
          
          <!-- Two-Factor Authentication -->
          <div id="twoFactorForm" class="auth-form">
            <div class="two-factor-header">
              <h3>Two-Factor Authentication</h3>
              <p>Enter the verification code from your authenticator app</p>
            </div>
            <form onsubmit="authSystem.handleTwoFactor(event)">
              <div class="form-group">
                <div class="verification-inputs">
                  <input type="text" maxlength="1" class="verification-digit" data-index="0">
                  <input type="text" maxlength="1" class="verification-digit" data-index="1">
                  <input type="text" maxlength="1" class="verification-digit" data-index="2">
                  <input type="text" maxlength="1" class="verification-digit" data-index="3">
                  <input type="text" maxlength="1" class="verification-digit" data-index="4">
                  <input type="text" maxlength="1" class="verification-digit" data-index="5">
                </div>
              </div>
              <button type="submit" class="auth-btn primary">Verify</button>
              <button type="button" class="auth-btn secondary" onclick="authSystem.resendTwoFactor()">Resend Code</button>
            </form>
          </div>
          
          <!-- Forgot Password -->
          <div id="forgotPasswordForm" class="auth-form">
            <div class="forgot-header">
              <h3>Reset Password</h3>
              <p>Enter your email address and we'll send you a reset link</p>
            </div>
            <form onsubmit="authSystem.handleForgotPassword(event)">
              <div class="form-group">
                <label for="forgotEmail">Email</label>
                <input type="email" id="forgotEmail" required>
              </div>
              <button type="submit" class="auth-btn primary">Send Reset Link</button>
              <button type="button" class="auth-btn secondary" onclick="authSystem.showLogin()">Back to Sign In</button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Add authentication CSS
    const authStyles = `
      <style id="auth-styles">
        .auth-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }
        
        .auth-modal-content {
          background: #1c1c1c;
          border: 1px solid #444;
          border-radius: 12px;
          width: 90%;
          max-width: 450px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .auth-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #333;
        }
        
        .auth-header h2 {
          color: #c69c6d;
          margin: 0;
          font-size: 1.5rem;
        }
        
        .auth-close {
          background: none;
          border: none;
          color: #999;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .auth-close:hover {
          color: #fff;
        }
        
        .auth-tabs {
          display: flex;
          border-bottom: 1px solid #333;
        }
        
        .auth-tab {
          flex: 1;
          background: none;
          border: none;
          color: #999;
          padding: 15px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .auth-tab.active {
          color: #c69c6d;
          border-bottom: 2px solid #c69c6d;
        }
        
        .auth-form {
          display: none;
          padding: 20px;
        }
        
        .auth-form.active {
          display: block;
        }
        
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .form-group label {
          display: block;
          color: #f0e6d2;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        .form-group input {
          width: 100%;
          background: #2c2c2c;
          border: 1px solid #444;
          color: #f0e6d2;
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          font-family: Georgia, serif;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #c69c6d;
          box-shadow: 0 0 0 2px rgba(198, 156, 109, 0.2);
        }
        
        .password-toggle {
          position: absolute;
          right: 12px;
          top: 32px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 16px;
        }
        
        .password-strength {
          margin-top: 8px;
        }
        
        .strength-bar {
          height: 3px;
          background: #333;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .strength-fill {
          height: 100%;
          width: 0%;
          transition: all 0.3s;
          border-radius: 2px;
        }
        
        .strength-text {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #f0e6d2;
        }
        
        .checkbox-label input[type="checkbox"] {
          display: none;
        }
        
        .checkmark {
          width: 18px;
          height: 18px;
          background: #2c2c2c;
          border: 1px solid #444;
          border-radius: 3px;
          margin-right: 8px;
          position: relative;
          flex-shrink: 0;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark {
          background: #c69c6d;
          border-color: #c69c6d;
        }
        
        .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #121212;
          font-size: 12px;
          font-weight: bold;
        }
        
        .auth-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-family: Georgia, serif;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 10px;
        }
        
        .auth-btn.primary {
          background: #c69c6d;
          color: #121212;
          font-weight: bold;
        }
        
        .auth-btn.primary:hover {
          background: #dab785;
        }
        
        .auth-btn.secondary {
          background: transparent;
          color: #c69c6d;
          border: 1px solid #c69c6d;
        }
        
        .auth-btn.secondary:hover {
          background: rgba(198, 156, 109, 0.1);
        }
        
        .auth-divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
          color: #999;
          font-size: 14px;
        }
        
        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #333;
        }
        
        .auth-divider span {
          background: #1c1c1c;
          padding: 0 15px;
        }
        
        .social-auth {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 12px;
          border: 1px solid #444;
          border-radius: 6px;
          background: #2c2c2c;
          color: #f0e6d2;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        
        .social-btn:hover {
          background: #3c3c3c;
          border-color: #555;
        }
        
        .verification-inputs {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        
        .verification-digit {
          width: 50px !important;
          height: 50px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
        }
        
        .two-factor-header, .forgot-header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .two-factor-header h3, .forgot-header h3 {
          color: #c69c6d;
          margin: 0 0 10px 0;
        }
        
        .two-factor-header p, .forgot-header p {
          color: #999;
          margin: 0;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .auth-modal-content {
            width: 95%;
            margin: 20px;
          }
          
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .verification-inputs {
            gap: 8px;
          }
          
          .verification-digit {
            width: 40px !important;
            height: 40px;
            font-size: 18px;
          }
        }
      </style>
    `;

    // Add to page if not exists
    if (!document.getElementById('authModal')) {
      document.body.insertAdjacentHTML('beforeend', authModalHTML);
    }
    
    if (!document.getElementById('auth-styles')) {
      document.head.insertAdjacentHTML('beforeend', authStyles);
    }

    // Setup tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabType = tab.dataset.tab;
        this.switchAuthTab(tabType);
      });
    });

    // Setup verification input handling
    this.setupVerificationInputs();
    
    // Setup password strength checker
    this.setupPasswordStrength();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for auth state changes
    this.onAuthStateChange((user) => {
      this.updateAuthUI(user);
      
      // Track authentication events
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent('auth_state_change', {
          user_id: user?.id,
          is_authenticated: !!user
        });
      }
    });

    // Setup logout button if it exists
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Setup login button if it exists
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showAuthModal('login'));
    }
  }

  /**
   * Setup automatic token refresh
   */
  setupTokenRefresh() {
    // Refresh token 5 minutes before expiry
    setInterval(async () => {
      if (this.authToken && this.refreshToken) {
        try {
          const tokenData = this.parseJWT(this.authToken);
          const expiryTime = tokenData.exp * 1000;
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;
          
          if (expiryTime - now < fiveMinutes) {
            await this.refreshAuthToken();
          }
        } catch (_error) {
          console.error('Error checking token expiry:', error);
        }
      }
    }, 60000); // Check every minute
  }

  /**
   * Show authentication modal
   */
  showAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.style.display = 'flex';
      this.switchAuthTab(tab);
      
      // Focus first input
      setTimeout(() => {
        const firstInput = modal.querySelector('.auth-form.active input');
        if (firstInput) {firstInput.focus();}
      }, 100);
    }
  }

  /**
   * Close authentication modal
   */
  closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.style.display = 'none';
      this.clearAuthForms();
    }
  }

  /**
   * Switch authentication tab
   */
  switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tab);
    });

    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });

    const targetForm = document.getElementById(`${tab}Form`);
    if (targetForm) {
      targetForm.classList.add('active');
    }
  }

  /**
   * Handle login form submission
   */
  async handleLogin(event) {
    event.preventDefault();
    
    if (window.uiManager) {
      window.uiManager.showLoading('loginForm', 'dots');
    }

    try {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const rememberMe = document.getElementById('rememberMe').checked;

      const response = await this.apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          rememberMe
        })
      });

      if (response.requiresTwoFactor) {
        this.pendingAuth = { email, password };
        this.switchAuthTab('twoFactor');
        window.uiManager?.showToast('Please enter your 2FA code', 'info');
      } else {
        await this.handleAuthSuccess(response);
      }

    } catch (_error) {
      console.error('Login error:', error);
      window.uiManager?.showToast(error.message || 'Login failed', 'error');
    } finally {
      if (window.uiManager) {
        window.uiManager.hideLoading('loginForm');
      }
    }
  }

  /**
   * Handle registration form submission
   */
  async handleRegister(event) {
    event.preventDefault();
    
    if (window.uiManager) {
      window.uiManager.showLoading('registerForm', 'dots');
    }

    try {
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validate password match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const strength = this.calculatePasswordStrength(password);
      if (strength.score < 3) {
        throw new Error('Password is too weak. Please use a stronger password.');
      }

      // Register user with API
      await this.apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      window.uiManager?.showToast('Account created successfully! Please check your email to verify your account.', 'success');
      this.switchAuthTab('login');

    } catch (_error) {
      console.error('Registration error:', error);
      window.uiManager?.showToast(error.message || 'Registration failed', 'error');
    } finally {
      if (window.uiManager) {
        window.uiManager.hideLoading('registerForm');
      }
    }
  }

  /**
   * Handle two-factor authentication
   */
  async handleTwoFactor(event) {
    event.preventDefault();
    
    try {
      const code = Array.from(document.querySelectorAll('.verification-digit'))
        .map(input => input.value)
        .join('');

      if (code.length !== 6) {
        throw new Error('Please enter the complete 6-digit code');
      }

      const response = await this.apiRequest('/api/auth/verify-2fa', {
        method: 'POST',
        body: JSON.stringify({
          email: this.pendingAuth.email,
          code
        })
      });

      await this.handleAuthSuccess(response);

    } catch (_error) {
      console.error('2FA error:', error);
      window.uiManager?.showToast(error.message || '2FA verification failed', 'error');
    }
  }

  /**
   * Handle forgot password
   */
  async handleForgotPassword(event) {
    event.preventDefault();
    
    try {
      const email = document.getElementById('forgotEmail').value;

      await this.apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      window.uiManager?.showToast('Password reset link sent to your email', 'success');
      this.switchAuthTab('login');

    } catch (_error) {
      console.error('Forgot password error:', error);
      window.uiManager?.showToast(error.message || 'Failed to send reset email', 'error');
    }
  }

  /**
   * Handle social login
   */
  async socialLogin(provider) {
    try {
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent('social_login_attempt', { provider });
      }

      // Open popup for social login
      const popup = window.open(
        `${this.apiBaseUrl}/api/auth/${provider}`,
        'socialLogin',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          this.checkSocialLoginResult();
        }
      }, 1000);

    } catch (_error) {
      console.error('Social login error:', error);
      window.uiManager?.showToast('Social login failed', 'error');
    }
  }

  /**
   * Handle successful authentication
   */
  async handleAuthSuccess(response) {
    this.authToken = response.token;
    this.refreshToken = response.refreshToken;
    this.currentUser = response.user;
    
    this.saveAuthData();
    this.closeAuthModal();
    this.notifyAuthStateChange(this.currentUser);
    
    window.uiManager?.showToast(`Welcome back, ${this.currentUser.firstName}!`, 'success');
    
    if (window.analyticsManager) {
      window.analyticsManager.trackEvent('user_login', {
        user_id: this.currentUser.id,
        login_method: response.method || 'email'
      });
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      if (this.authToken) {
        await this.apiRequest('/api/auth/logout', {
          method: 'POST'
        });
      }
    } catch (_error) {
      console.error('Logout error:', _error);
    } finally {
      this.authToken = null;
      this.refreshToken = null;
      this.currentUser = null;
      this.saveAuthData();
      this.notifyAuthStateChange(null);
      
      window.uiManager?.showToast('Logged out successfully', 'info');
      
      if (window.analyticsManager) {
        window.analyticsManager.trackEvent('user_logout');
      }
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthToken() {
    try {
      const response = await this.apiRequest('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      this.authToken = response.token;
      this.saveAuthData();
      
      return response.token;
    } catch (_error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      throw error;
    }
  }

  /**
   * Validate current token
   */
  async validateToken() {
    try {
      const response = await this.apiRequest('/api/auth/validate');
      this.currentUser = response.user;
      this.notifyAuthStateChange(this.currentUser);
      return true;
    } catch (_error) {
      console.error('Token validation failed:', error);
      await this.logout();
      return false;
    }
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(endpoint, options = {}) {
    // If we're in fallback mode and know API is unavailable, return mock response
    if (this.fallbackMode && this.offlineMode) {
      console.warn('🔐 Auth API unavailable - using local fallback');
      return this.generateMockResponse(endpoint, options);
    }

    const url = `${this.apiBaseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: 5000 // 5 second timeout
      });

    if (response.status === 401 && this.refreshToken) {
      // Try to refresh token
      try {
        await this.refreshAuthToken();
        headers.Authorization = `Bearer ${this.authToken}`;
        
        // Retry original request
        const retryResponse = await fetch(url, {
          ...options,
          headers
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
        }
        
        return await retryResponse.json();
      } catch (_refreshError) {
        await this.logout();
        throw new Error('Session expired. Please log in again.');
      }
    }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
      
    } catch (_error) {
      console.error('🔐 Auth API request failed:', error);
      
      // Mark as offline and use fallback
      this.offlineMode = true;
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.warn('🔐 Network error - switching to offline mode');
        return this.generateMockResponse(endpoint, options);
      }
      
      throw error;
    }
  }

  /**
   * Generate mock response for offline mode
   */
  generateMockResponse(endpoint, _options) {
    console.log('🔐 Generating mock response for:', endpoint);
    
    // Basic mock responses for common endpoints
    const mockResponses = {
      '/auth/login': { success: true, token: 'mock-token', user: { id: 'local-user', name: 'Local User' } },
      '/auth/refresh': { success: true, token: 'mock-token-refreshed' },
      '/auth/logout': { success: true },
      '/auth/register': { success: true, message: 'Registration successful' },
      '/user/profile': { id: 'local-user', name: 'Local User', email: 'local@example.com' }
    };
    
    return mockResponses[endpoint] || { success: true, message: 'Mock response' };
  }

  /**
   * Setup verification input behavior
   */
  setupVerificationInputs() {
    document.querySelectorAll('.verification-digit').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const {value} = e.target;
        
        // Only allow numbers
        if (!/^\d*$/.test(value)) {
          e.target.value = '';
          return;
        }

        // Move to next input if current is filled
        if (value && index < 5) {
          const nextInput = document.querySelector(`.verification-digit[data-index="${index + 1}"]`);
          if (nextInput) {nextInput.focus();}
        }
      });

      input.addEventListener('keydown', (e) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          const prevInput = document.querySelector(`.verification-digit[data-index="${index - 1}"]`);
          if (prevInput) {prevInput.focus();}
        }
      });
    });
  }

  /**
   * Setup password strength checker
   */
  setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        const strength = this.calculatePasswordStrength(e.target.value);
        this.updatePasswordStrengthUI(strength);
      });
    }
  }

  /**
   * Calculate password strength
   */
  calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    const colors = ['#dc143c', '#ff6b35', '#f7931e', '#c69c6d', '#28a745'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    return {
      score,
      percentage: (score / 5) * 100,
      color: colors[score - 1] || colors[0],
      label: labels[score - 1] || labels[0],
      checks
    };
  }

  /**
   * Update password strength UI
   */
  updatePasswordStrengthUI(strength) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (strengthFill && strengthText) {
      strengthFill.style.width = `${strength.percentage}%`;
      strengthFill.style.background = strength.color;
      strengthText.textContent = strength.label;
      strengthText.style.color = strength.color;
    }
  }

  /**
   * Toggle password visibility
   */
  togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = '🙈';
    } else {
      input.type = 'password';
      button.textContent = '👁️';
    }
  }

  /**
   * Clear authentication forms
   */
  clearAuthForms() {
    document.querySelectorAll('.auth-form input').forEach(input => {
      input.value = '';
    });
    
    document.querySelectorAll('.auth-form input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
  }

  /**
   * Parse JWT token
   */
  parseJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (_error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  /**
   * Authentication state management
   */
  onAuthStateChange(callback) {
    this.authListeners.add(callback);
  }

  offAuthStateChange(callback) {
    this.authListeners.delete(callback);
  }

  notifyAuthStateChange(user) {
    this.authListeners.forEach(callback => {
      try {
        callback(user);
      } catch (_error) {
        console.error('Error in auth state change callback:', error);
      }
    });
  }

  /**
   * Update authentication UI
   */
  updateAuthUI(user) {
    // Update login/logout buttons
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');

    if (user) {
      // User is logged in
      if (loginBtn) {loginBtn.style.display = 'none';}
      if (logoutBtn) {logoutBtn.style.display = 'block';}
      if (userProfile) {
        userProfile.style.display = 'block';
        userProfile.textContent = `Welcome, ${user.firstName}`;
      }
    } else {
      // User is logged out
      if (loginBtn) {loginBtn.style.display = 'block';}
      if (logoutBtn) {logoutBtn.style.display = 'none';}
      if (userProfile) {userProfile.style.display = 'none';}
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.authToken && !!this.currentUser;
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return this.authToken;
  }

  /**
   * Show forgot password form
   */
  showForgotPassword() {
    this.switchAuthTab('forgotPassword');
  }

  /**
   * Show login form
   */
  showLogin() {
    this.switchAuthTab('login');
  }

  /**
   * Resend two-factor authentication code
   */
  async resendTwoFactor() {
    try {
      await this.apiRequest('/api/auth/resend-2fa', {
        method: 'POST',
        body: JSON.stringify({
          email: this.pendingAuth.email
        })
      });

      window.uiManager?.showToast('Verification code resent', 'success');
    } catch (_error) {
      window.uiManager?.showToast('Failed to resend code', 'error');
    }
  }

  /**
   * Check social login result
   */
  async checkSocialLoginResult() {
    try {
      const response = await this.apiRequest('/api/auth/social-result');
      if (response.success) {
        await this.handleAuthSuccess(response);
      }
    } catch (_error) {
      console.error('Social login result check failed:', error);
    }
  }
}

// Initialize authentication system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.authSystem = new AuthenticationSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthenticationSystem;
}