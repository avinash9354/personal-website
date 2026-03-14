// GSAP Animations
class PortfolioAnimations {
    constructor() {
        this.initScrollAnimations();
        this.initHoverAnimations();
        this.initPageTransitions();
    }
    
    initScrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach((section) => {
            gsap.from(section.querySelectorAll('.glass-card'), {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });
        });
        
        // Animate skill bars
        gsap.utils.toArray('.skill-progress').forEach((bar) => {
            const width = bar.getAttribute('data-width');
            gsap.from(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%'
                },
                width: '0%',
                duration: 1.5,
                ease: 'power2.out'
            });
        });
    }
    
    initHoverAnimations() {
        // Card hover animations
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
        
        // Neon glow on hover
        document.querySelectorAll('.neon-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
                    duration: 0.3
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    boxShadow: 'none',
                    duration: 0.3
                });
            });
        });
    }
    
    initPageTransitions() {
        // Page load animation
        gsap.from('body', {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        });
        
        // Animate floating nav
        gsap.from('.floating-nav', {
            y: -100,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: 'bounce.out'
        });
    }
    
    // Typing animation for home page
    initTypingAnimation(element, words) {
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        
        const type = () => {
            const currentWord = words[currentWordIndex];
            
            if (isDeleting) {
                element.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                element.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }
            
            if (!isDeleting && currentCharIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        };
        
        type();
    }
    
    // 3D tilt effect for cards
    initTiltEffect() {
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.animations = new PortfolioAnimations();
});