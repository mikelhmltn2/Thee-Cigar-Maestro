/**
 * Authentication UI Component
 * Handles user login, registration, and profile management
 */

class AuthUI {
  constructor() {
    this.apiClient = window.CigarMaestroAPI;
    this.isVisible = false;
    this.currentMode = 'login'; // 'login' or 'register'

    this.init();
  }

  init() {
    this.createAuthModal();
    this.setupEventListeners();
    this.checkAuthState();
  }

  createAuthModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'auth-modal-overlay';
    modalOverlay.className = 'auth-modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'auth-modal-container';
    modalContainer.style.cssText = `
      background: linear-gradient(135deg, #2c1810 0%, #8B4513 100%);
      border-radius: 15px;
      padding: 2rem;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border: 1px solid #CD853F;
      color: #f4f1eb;
      position: relative;
    `;

    modalContainer.innerHTML = `
      <button id="auth-modal-close" style="
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        color: #CD853F;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">&times;</button>

      <div class="auth-header" style="text-align: center; margin-bottom: 2rem;">
        <h2 id="auth-modal-title" style="color: #CD853F; margin: 0; font-size: 1.8rem;">Welcome Back</h2>
        <p style="color: #D2B48C; margin: 0.5rem 0 0 0; opacity: 0.9;">Sign in to access your cigar collection</p>
      </div>

      <form id="auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
        <div id="name-field" style="display: none;">
          <label style="color: #CD853F; margin-bottom: 0.5rem; display: block; font-weight: 500;">Full Name</label>
          <input 
            type="text" 
            id="auth-name" 
            placeholder="Enter your full name"
            style="
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #8B4513;
              border-radius: 8px;
              background-color: rgba(139, 69, 19, 0.1);
              color: #f4f1eb;
              font-size: 1rem;
              box-sizing: border-box;
            "
          />
        </div>

        <div>
          <label style="color: #CD853F; margin-bottom: 0.5rem; display: block; font-weight: 500;">Email Address</label>
          <input 
            type="email" 
            id="auth-email" 
            required 
            placeholder="Enter your email"
            style="
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #8B4513;
              border-radius: 8px;
              background-color: rgba(139, 69, 19, 0.1);
              color: #f4f1eb;
              font-size: 1rem;
              box-sizing: border-box;
            "
          />
        </div>

        <div>
          <label style="color: #CD853F; margin-bottom: 0.5rem; display: block; font-weight: 500;">Password</label>
          <input 
            type="password" 
            id="auth-password" 
            required 
            placeholder="Enter your password"
            style="
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #8B4513;
              border-radius: 8px;
              background-color: rgba(139, 69, 19, 0.1);
              color: #f4f1eb;
              font-size: 1rem;
              box-sizing: border-box;
            "
          />
        </div>

        <button 
          type="submit" 
          id="auth-submit-btn"
          style="
            background: linear-gradient(135deg, #CD853F 0%, #D2B48C 100%);
            color: #2c1810;
            border: none;
            padding: 0.875rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: all 0.3s ease;
          "
        >
          Sign In
        </button>
      </form>

      <div id="auth-error" style="
        color: #ff6b6b;
        background-color: rgba(255, 107, 107, 0.1);
        border: 1px solid rgba(255, 107, 107, 0.3);
        padding: 0.75rem;
        border-radius: 8px;
        margin-top: 1rem;
        display: none;
        font-size: 0.9rem;
      "></div>

      <div class="auth-switch" style="text-align: center; margin-top: 1.5rem; color: #D2B48C;">
        <span id="auth-switch-text">Don't have an account?</span>
        <button 
          id="auth-switch-btn" 
          style="
            background: none;
            border: none;
            color: #CD853F;
            cursor: pointer;
            text-decoration: underline;
            font-size: 1rem;
            margin-left: 0.5rem;
          "
        >
          Sign Up
        </button>
      </div>
    `;

    modalOverlay.appendChild(modalContainer);
    document.body.appendChild(modalOverlay);

    this.modal = modalOverlay;
    this.modalContainer = modalContainer;
  }

  setupEventListeners() {
    // Close modal events
    document.getElementById('auth-modal-close').addEventListener('click', () => this.hide());
    this.modal.addEventListener('click', e => {
      if (e.target === this.modal) this.hide();
    });

    // Form submission
    document.getElementById('auth-form').addEventListener('submit', e => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Mode switching
    document.getElementById('auth-switch-btn').addEventListener('click', () => {
      this.currentMode = this.currentMode === 'login' ? 'register' : 'login';
      this.updateUI();
    });

    // ESC key to close
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  updateUI() {
    const title = document.getElementById('auth-modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const nameField = document.getElementById('name-field');
    const switchText = document.getElementById('auth-switch-text');
    const switchBtn = document.getElementById('auth-switch-btn');

    if (this.currentMode === 'login') {
      title.textContent = 'Welcome Back';
      submitBtn.textContent = 'Sign In';
      nameField.style.display = 'none';
      switchText.textContent = "Don't have an account?";
      switchBtn.textContent = 'Sign Up';
    } else {
      title.textContent = 'Join the Community';
      submitBtn.textContent = 'Create Account';
      nameField.style.display = 'block';
      switchText.textContent = 'Already have an account?';
      switchBtn.textContent = 'Sign In';
    }

    this.clearError();
  }

  async handleFormSubmit() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value;

    this.clearError();
    this.setLoading(true);

    try {
      let response;

      if (this.currentMode === 'login') {
        response = await this.apiClient.login({ email, password });
      } else {
        if (!name.trim()) {
          throw new Error('Full name is required');
        }
        response = await this.apiClient.register({ email, password, name });
      }

      // Store user data
      this.apiClient.setCurrentUser(response.user);

      // Show success and hide modal
      this.showSuccess(
        `${this.currentMode === 'login' ? 'Signed in' : 'Account created'} successfully!`
      );

      setTimeout(() => {
        this.hide();
        this.updateAuthState();
        window.location.reload(); // Refresh to update UI
      }, 1500);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(isLoading) {
    const submitBtn = document.getElementById('auth-submit-btn');
    const form = document.getElementById('auth-form');

    if (isLoading) {
      submitBtn.textContent = 'Please wait...';
      submitBtn.disabled = true;
      form.style.opacity = '0.7';
    } else {
      submitBtn.disabled = false;
      form.style.opacity = '1';
      this.updateUI();
    }
  }

  showError(message) {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  showSuccess(message) {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#4CAF50';
    errorDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    errorDiv.style.borderColor = 'rgba(76, 175, 80, 0.3)';
  }

  clearError() {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.style.display = 'none';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
    errorDiv.style.borderColor = 'rgba(255, 107, 107, 0.3)';
  }

  show(mode = 'login') {
    this.currentMode = mode;
    this.updateUI();
    this.modal.style.display = 'flex';
    this.isVisible = true;

    // Focus on email field
    setTimeout(() => {
      document.getElementById('auth-email').focus();
    }, 100);
  }

  hide() {
    this.modal.style.display = 'none';
    this.isVisible = false;
    this.clearError();

    // Clear form
    document.getElementById('auth-form').reset();
  }

  checkAuthState() {
    const user = this.apiClient.getCurrentUser();
    if (user) {
      this.updateAuthState();
    }
  }

  updateAuthState() {
    // Update navigation or user interface based on auth state
    const user = this.apiClient.getCurrentUser();

    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent('authStateChange', {
        detail: { user, isAuthenticated: !!user },
      })
    );
  }

  logout() {
    this.apiClient.logout();
    this.updateAuthState();
    window.location.reload();
  }
}

// Initialize Auth UI
document.addEventListener('DOMContentLoaded', () => {
  window.authUI = new AuthUI();
});

export default AuthUI;
