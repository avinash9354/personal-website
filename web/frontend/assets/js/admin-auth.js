// ===== ADMIN PANEL PROTECTION =====
// This file is ONLY loaded by admin panel pages.
// It checks if the user is logged in as admin and redirects to login if not.
// Uses sessionStorage → auto-logout when browser/tab is closed.

(function() {
    const isAdmin = sessionStorage.getItem('isAdmin');
    const adminPages = ['dashboard.html', 'messages.html', 'settings.html', 'profile.html', 'ai-assistant.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    if (adminPages.includes(currentPage) && !isAdmin) {
        window.location.replace('login.html');
    }
})();

// ===== ADMIN LOGOUT HELPER =====
function adminLogout(e) {
    if (e) e.preventDefault();
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Attach logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', adminLogout);
    }

    // Show admin name in sidebar
    try {
        const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');
        const nameEls = document.querySelectorAll('.sidebar-user-name');
        nameEls.forEach(el => { if (adminUser.name) el.textContent = adminUser.name; });
    } catch(e) {}
});
