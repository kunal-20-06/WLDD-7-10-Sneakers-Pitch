// Presentation Management Class
class KunalPitchPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideSpan = document.querySelector('.current-slide');
        this.totalSlidesSpan = document.querySelector('.total-slides');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.isAnimating = false;
        this.lastKeyTime = 0;
        this.keyThrottle = 300; // Throttle keyboard input
        
        this.init();
    }
    
    init() {
        // Initialize slide counter
        this.updateSlideCounter();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial button states
        this.updateButtonStates();
        
        // Add keyboard and touch navigation
        this.addKeyboardNavigation();
        this.addTouchSupport();
        
        // Handle image loading
        this.handleImageLoading();
        
        console.log('Kunal\'s 7-10 Pitch Presentation Ready! 🚀');
    }
    
    addEventListeners() {
        // Navigation button listeners
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked, current slide:', this.currentSlide);
                this.nextSlide();
            });
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked, current slide:', this.currentSlide);
                this.previousSlide();
            });
        }
        
        // Click to advance slides (except on interactive elements)
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                if (!e.target.matches('button, a, input, select, textarea, .nav-btn, .navigation-buttons, .slide-navigation, .contact-link, .portfolio-link, .linkedin-link, .cover-letter-link')) {
                    console.log('Slide clicked, advancing from slide:', this.currentSlide);
                    this.nextSlide();
                }
            });
        });
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const now = Date.now();
            if (this.isAnimating || (now - this.lastKeyTime) < this.keyThrottle) {
                return;
            }
            
            this.lastKeyTime = now;
            
            switch(e.key) {
                case 'ArrowRight':
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    console.log('Keyboard next, current slide:', this.currentSlide);
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'Backspace':
                    e.preventDefault();
                    console.log('Keyboard previous, current slide:', this.currentSlide);
                    this.previousSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const swipeThreshold = 50;
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = Math.abs(touchEndY - touchStartY);
            
            // Only handle horizontal swipes if vertical swipe is not significant
            if (Math.abs(swipeDistanceX) > swipeThreshold && swipeDistanceY < 100) {
                if (swipeDistanceX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }
    
    nextSlide() {
        if (this.isAnimating) {
            console.log('Animation in progress, ignoring next slide request');
            return;
        }
        
        if (this.currentSlide >= this.totalSlides) {
            console.log('Already at last slide');
            return;
        }
        
        const nextSlideNumber = this.currentSlide + 1;
        console.log('Moving to next slide:', nextSlideNumber);
        this.goToSlide(nextSlideNumber);
    }
    
    previousSlide() {
        if (this.isAnimating) {
            console.log('Animation in progress, ignoring previous slide request');
            return;
        }
        
        if (this.currentSlide <= 1) {
            console.log('Already at first slide');
            return;
        }
        
        const prevSlideNumber = this.currentSlide - 1;
        console.log('Moving to previous slide:', prevSlideNumber);
        this.goToSlide(prevSlideNumber);
    }
    
    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide) {
            console.log('Cannot go to slide:', slideNumber, 'Current:', this.currentSlide, 'Animating:', this.isAnimating);
            return;
        }
        
        console.log('Transitioning from slide', this.currentSlide, 'to slide', slideNumber);
        
        this.isAnimating = true;
        const oldSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Update slide visibility with animation
        this.updateSlideVisibility(oldSlide);
        
        // Update UI elements
        this.updateSlideCounter();
        this.updateButtonStates();
        
        // Trigger slide-specific animations
        setTimeout(() => {
            this.onSlideChange(slideNumber);
            this.isAnimating = false;
            console.log('Transition complete, now on slide:', this.currentSlide);
        }, 100);
    }
    
    updateSlideVisibility(oldSlideNumber) {
        // Remove active and prev classes from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Add prev class to old slide for exit animation
        if (oldSlideNumber && this.slides[oldSlideNumber - 1]) {
            this.slides[oldSlideNumber - 1].classList.add('prev');
        }
        
        // Add active class to current slide
        const currentSlideElement = this.slides[this.currentSlide - 1];
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
            console.log('Activated slide element for slide:', this.currentSlide);
        } else {
            console.error('Could not find slide element for slide:', this.currentSlide);
        }
        
        // Clean up prev class after animation
        setTimeout(() => {
            this.slides.forEach(slide => {
                slide.classList.remove('prev');
            });
        }, 600);
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateButtonStates() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.innerHTML = '✓';
                this.nextBtn.title = 'Presentation Complete';
            } else {
                this.nextBtn.innerHTML = '→';
                this.nextBtn.title = 'Next Slide';
            }
        }
    }
    
    handleImageLoading() {
        // Handle all images with better error handling and fallbacks
        const images = document.querySelectorAll('.gif-image, .profile-image');
        
        images.forEach((img, index) => {
            // Add loading state
            img.style.opacity = '0';
            
            const loadImage = () => {
                img.onload = () => {
                    console.log(`Image ${index + 1} loaded successfully:`, img.src);
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                };
                
                img.onerror = () => {
                    console.warn(`Failed to load image ${index + 1}:`, img.src);
                    this.createImageFallback(img);
                };
                
                // Force reload if src is already set
                if (img.src) {
                    if (img.complete) {
                        if (img.naturalWidth === 0) {
                            img.onerror();
                        } else {
                            img.onload();
                        }
                    }
                } else {
                    img.onerror();
                }
            };
            
            // Try loading immediately
            loadImage();
            
            // Also try after a short delay in case of timing issues
            setTimeout(loadImage, 1000);
        });
    }
    
    createImageFallback(originalImg) {
        const container = originalImg.parentElement;
        if (!container) return;
        
        // Create placeholder with slide-specific content
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, var(--brand-orange), var(--brand-navy));
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-base);
            color: white;
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-bold);
            text-align: center;
            padding: var(--space-16);
            box-sizing: border-box;
        `;
        
        // Add slide-specific placeholder content
        const slideNumber = originalImg.closest('.slide')?.dataset.slide;
        let placeholderContent = '';
        
        switch(slideNumber) {
            case '1':
                placeholderContent = '🔥<br>SWAG ENTRY<br><small style="font-size: 14px;">Ready to Overstep!</small>';
                break;
            case '2':
                placeholderContent = '🤝<br>BANOGE DOST<br><small style="font-size: 14px;">Perfect Partnership</small>';
                break;
            case '3':
                placeholderContent = '💪<br>TRANSFORMATION<br><small style="font-size: 14px;">Growth Mode</small>';
                break;
            case '4':
                placeholderContent = '😤<br>NOT FUNNY<br><small style="font-size: 14px;">Serious Business</small>';
                break;
            case '5':
                placeholderContent = '👟<br>SNEAKERHEAD<br><small style="font-size: 14px;">Passion for Kicks</small>';
                break;
            case '6':
                placeholderContent = '🙏<br>PLEASE<br><small style="font-size: 14px;">Give me this opportunity</small>';
                break;
            case '7':
                placeholderContent = '🚀<br>LANDING<br><small style="font-size: 14px;">Ready to deliver</small>';
                break;
            case '8':
                placeholderContent = '💥<br>BANG<br><small style="font-size: 14px;">Master plan activated</small>';
                break;
            case '9':
                placeholderContent = '✅<br>HO JAYEGA<br><small style="font-size: 14px;">It will happen</small>';
                break;
            case '10':
                placeholderContent = '👤<br>KUNAL<br><small style="font-size: 14px;">Your next Marketing Head</small>';
                break;
            default:
                placeholderContent = '🎬<br>MEME MAGIC<br><small style="font-size: 14px;">Content Loading...</small>';
        }
        
        placeholder.innerHTML = placeholderContent;
        
        // Replace the original image
        originalImg.style.display = 'none';
        container.appendChild(placeholder);
        
        // Try to reload the original image after a delay
        setTimeout(() => {
            const newImg = new Image();
            newImg.onload = () => {
                originalImg.src = newImg.src;
                originalImg.style.display = 'block';
                originalImg.style.opacity = '1';
                placeholder.remove();
                console.log('Image successfully loaded on retry:', newImg.src);
            };
            newImg.src = originalImg.dataset.src || originalImg.src;
        }, 3000);
    }
    
    onSlideChange(slideNumber) {
        // Reset any existing animations
        this.resetAnimations();
        
        // Slide-specific actions
        switch(slideNumber) {
            case 1:
                setTimeout(() => this.animateTitle(), 200);
                break;
            case 4:
                setTimeout(() => this.animateMetrics(), 300);
                break;
            case 5:
                setTimeout(() => this.animateSneakerCounter(), 400);
                break;
            case 7:
                setTimeout(() => this.animateFocusAreas(), 300);
                break;
            case 8:
                setTimeout(() => this.animateRoadmap(), 300);
                break;
            case 9:
                setTimeout(() => this.animateProjections(), 300);
                break;
            case 10:
                setTimeout(() => this.finalSlideActions(), 200);
                break;
        }
    }
    
    resetAnimations() {
        // Reset counter if leaving slide 5
        const counter = document.getElementById('sneaker-counter');
        if (counter && this.currentSlide !== 5) {
            counter.textContent = '0';
        }
        
        // Reset any CSS animations
        document.querySelectorAll('.animate-in').forEach(el => {
            el.classList.remove('animate-in');
        });
    }
    
    animateTitle() {
        const titleSlide = document.querySelector('[data-slide="1"]');
        if (!titleSlide || !titleSlide.classList.contains('active')) return;
        
        const title = titleSlide.querySelector('h1');
        const subtitle = titleSlide.querySelector('h2');
        
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            setTimeout(() => {
                title.style.transition = 'all 0.8s ease-out';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 100);
        }
        
        if (subtitle) {
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(30px)';
            setTimeout(() => {
                subtitle.style.transition = 'all 0.8s ease-out';
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 400);
        }
    }
    
    animateMetrics() {
        const metricCards = document.querySelectorAll('[data-slide="4"] .metric-card');
        metricCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 200 + (index * 150));
        });
    }
    
    animateSneakerCounter() {
        const counter = document.getElementById('sneaker-counter');
        if (!counter) return;
        
        let start = 0;
        const end = 24;
        const duration = 2000;
        const increment = end / (duration / 50);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                counter.textContent = end.toString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(start).toString();
            }
        }, 50);
    }
    
    animateFocusAreas() {
        const focusItems = document.querySelectorAll('[data-slide="7"] .focus-item');
        focusItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 150 + (index * 150));
        });
    }
    
    animateRoadmap() {
        const roadmapSteps = document.querySelectorAll('[data-slide="8"] .roadmap-step');
        roadmapSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(20px)';
            setTimeout(() => {
                step.style.transition = 'all 0.5s ease-out';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, 200 + (index * 200));
        });
    }
    
    animateProjections() {
        const projectionCards = document.querySelectorAll('[data-slide="9"] .projection-card');
        projectionCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'rotateY(90deg)';
            setTimeout(() => {
                card.style.transition = 'all 0.7s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'rotateY(0deg)';
            }, 200 + (index * 200));
        });
    }
    
    finalSlideActions() {
        const contactLinks = document.querySelectorAll('[data-slide="10"] .contact-link, [data-slide="10"] .portfolio-link, [data-slide="10"] .linkedin-link, [data-slide="10"] .cover-letter-link');
        
        contactLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(20px)';
            setTimeout(() => {
                link.style.transition = 'all 0.5s ease-out';
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
        
        // Add pulse animation to portfolio links
        setTimeout(() => {
            contactLinks.forEach(link => {
                link.style.animation = 'pulse 2s infinite';
            });
        }, 1000);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Public methods
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    jumpToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
}

// Global functions for backward compatibility
function nextSlide() {
    if (window.presentationManager) {
        window.presentationManager.nextSlide();
    }
}

function previousSlide() {
    if (window.presentationManager) {
        window.presentationManager.previousSlide();
    }
}

function goToSlide(slideNumber) {
    if (window.presentationManager) {
        window.presentationManager.jumpToSlide(slideNumber);
    }
}

// Add CSS animations dynamically
function addCustomAnimations() {
    if (document.getElementById('custom-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'custom-animations';
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideInLeft {
            from { 
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: scale(0.3);
            }
            50% {
                transform: scale(1.05);
            }
            70% {
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-bounce {
            animation: bounceIn 0.8s ease-out;
        }
        
        .image-placeholder {
            animation: bounceIn 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Easter eggs and fun interactions
function addEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            triggerSneakerEasterEgg();
        }
    });
    
    // Double-click on GIFs for surprise
    document.addEventListener('dblclick', (e) => {
        if (e.target.matches('.gif-image, .image-placeholder')) {
            e.target.style.animation = 'bounceIn 0.6s ease-out';
            setTimeout(() => {
                e.target.style.animation = '';
            }, 600);
        }
    });
}

function triggerSneakerEasterEgg() {
    // Create sneaker emoji confetti
    const sneakerEmojis = ['👟', '👠', '🥿', '👞', '🦶'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createEmojiConfetti(sneakerEmojis[Math.floor(Math.random() * sneakerEmojis.length)]);
        }, i * 100);
    }
    
    // Show easter egg message
    setTimeout(() => {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FF6B35, #2C3E50);
            color: white;
            padding: 24px 48px;
            border-radius: 12px;
            font-size: 20px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            animation: bounceIn 0.8s ease-out;
        `;
        message.innerHTML = '🔥 KUNAL IS READY TO OVERSTEP THE GAME! 🔥<br><small style="font-size: 14px; opacity: 0.9;">Easter egg unlocked! 👟</small>';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 4000);
    }, 1500);
}

function createEmojiConfetti(emoji) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        font-size: 24px;
        z-index: 9999;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: -50px;
        animation: fall 4s linear forwards;
    `;
    confetti.textContent = emoji;
    
    // Add fall animation if not exists
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes fall {
                0% { 
                    transform: translateY(-50px) rotate(0deg); 
                    opacity: 1; 
                }
                100% { 
                    transform: translateY(100vh) rotate(720deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 4000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Kunal\'s 7-10 Pitch Presentation...');
    
    // Add custom animations
    addCustomAnimations();
    
    // Initialize presentation manager
    window.presentationManager = new KunalPitchPresentation();
    
    // Add easter eggs
    addEasterEggs();
    
    // Add focus management for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    console.log('✅ Presentation loaded successfully!');
    console.log('💡 Tip: Use arrow keys, spacebar, or click to navigate');
    console.log('🎮 Try the Konami code for a surprise!');
});

// Debug utilities for development
window.debugPresentation = {
    currentSlide: () => window.presentationManager?.getCurrentSlide(),
    totalSlides: () => window.presentationManager?.getTotalSlides(),
    jumpTo: (slide) => window.presentationManager?.jumpToSlide(slide),
    triggerEasterEgg: () => triggerSneakerEasterEgg(),
    fullscreen: () => window.presentationManager?.toggleFullscreen()
};