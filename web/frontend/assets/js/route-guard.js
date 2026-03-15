// ===== ROUTE GUARD + SESSION AUTH =====
// Uses sessionStorage so sessions expire automatically when the tab/browser is closed.
// Also injects a Logout button into the nav on every protected page.

(function () {
    var publicPages = [
        'login.html', 
        'signup.html', 
        '404.html'
    ];
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Allow public pages through without auth check
    if (publicPages.indexOf(currentPage) !== -1) return;

    // Check sessionStorage (clears automatically on tab/browser close → auto-logout)
    var isLoggedIn = sessionStorage.getItem('loggedIn');
    var isAdmin    = sessionStorage.getItem('isAdmin');

    if (!isLoggedIn && !isAdmin) {
        // Hide body to prevent flash of content before redirect
        document.documentElement.style.visibility = 'hidden';
        window.location.replace('login.html');
        return;
    }

    // ---- Inject Logout button into nav after DOM is ready ----
    document.addEventListener('DOMContentLoaded', function () {
        var nav = document.querySelector('.floating-nav');
        if (!nav) return;

        // Create logout button
        var logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.id = 'nav-logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.style.cssText = [
            'color: #ff006e',
            'font-weight: 700',
            'cursor: pointer',
            'display: flex',
            'align-items: center',
            'gap: 6px',
            'transition: opacity 0.2s',
            'white-space: nowrap'
        ].join(';');

        logoutBtn.addEventListener('mouseenter', function () { this.style.opacity = '0.7'; });
        logoutBtn.addEventListener('mouseleave', function () { this.style.opacity = '1'; });

        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Clear ALL auth keys from sessionStorage
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        });

        // Insert before the hamburger button (or at end)
        var hamburger = nav.querySelector('.nav-hamburger');
        if (hamburger) {
            nav.insertBefore(logoutBtn, hamburger);
        } else {
            nav.appendChild(logoutBtn);
        }

        // Also inject into mobile nav
        var mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            var mobileLogout = document.createElement('a');
            mobileLogout.href = '#';
            mobileLogout.innerHTML = '🚪 Logout';
            mobileLogout.style.cssText = 'color:#ff006e;font-weight:700;';
            mobileLogout.addEventListener('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('loggedIn');
                sessionStorage.removeItem('isAdmin');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('adminUser');
                window.location.href = 'login.html';
            });
            mobileNav.appendChild(mobileLogout);
        }
    });
})();
