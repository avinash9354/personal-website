// Firebase Auth is handled via module scripts in login.html and signup.html.
// This file manages route protection and UI updates based on localStorage state
// which is set by the Firebase module scripts after a successful login.

// Authentication Handler
class AuthHandler {
    constructor() {
        this.loggedIn = !!localStorage.getItem('loggedIn');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
        this.init();
    }
    
    init() {
        this.updateUI();
        this.addEventListeners();
        this.protectRoutes();
    }
    
    addEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            this.showNotification('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification(error.message || 'Login failed', 'error');
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }
        
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update profile with name
            await user.updateProfile({
                displayName: name
            });
            
            this.showNotification('Account created successfully! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } catch (error) {
            console.error('Signup error:', error);
            this.showNotification(error.message || 'Registration failed', 'error');
        }
    }
    
    handleLogout(e) {
        e.preventDefault();
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.loggedIn = false;
        this.user = null;
        this.showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
    
    protectRoutes() {
        // Public pages that don't require authentication
        const publicPages = ['login.html', 'signup.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!publicPages.includes(currentPage) && !this.loggedIn) {
            window.location.replace('login.html');
        }
    }
    
    updateUI() {
        const authLinks = document.querySelectorAll('.auth-link');
        const userLinks = document.querySelectorAll('.user-link');
        
        if (this.loggedIn) {
            authLinks.forEach(link => link.style.display = 'none');
            userLinks.forEach(link => link.style.display = 'block');
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(el => {
                el.textContent = this.user?.name || 'User';
            });
        } else {
            authLinks.forEach(link => link.style.display = 'block');
            userLinks.forEach(link => link.style.display = 'none');
        }
    }
    
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    async makeAuthenticatedRequest(url, options = {}) {
        if (!this.token) {
            window.location.href = 'login.html';
            return null;
        }
        
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`
        };
        
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            
            if (response.status === 401) {
                // Token expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return null;
            }
            
            return data;
        } catch (error) {
            console.error('Request error:', error);
            return null;
        }
    }
}

// Initialize auth handler
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthHandler();
});