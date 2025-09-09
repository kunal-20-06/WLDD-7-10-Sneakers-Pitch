// Slide management functionality
class PresentationManager {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 10;
        this.slides = document.querySelectorAll('.slide');
        this.currentSlideSpan = document.querySelector('.current-slide');
        this.totalSlidesSpan = document.querySelector('.total-slides');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        this.init();
    }
    
    init() {
        // Initialize slide counter
        this.updateSlideCounter();
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial button states
        this.updateButtonStates();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
        
        // Initialize meme-specific interactions
        this.setupMemeInteractions();
        
        // Add touch gestures
        this.addTouchSupport();
        
        console.log('🎯 Kunal\'s 7-10 Pitch Presentation initialized with', this.totalSlides, 'slides');
        console.log('💡 Controls: Click, Space/Enter, Arrow keys, or swipe to navigate');
    }
    
    addEventListeners() {
        // Navigation button listeners
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        });
        
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousSlide();
        });
        
        // Add click listeners to slides for next navigation (except interactive elements)
        this.slides.forEach(slide => {
            slide.addEventListener('click', (e) => {
                // Only advance if not clicking on interactive elements
                if (!e.target.matches('button, a, input, select, textarea, .nav-btn, .navigation-buttons, .slide-navigation, .cta-button')) {
                    // Allow meme interactions without advancing
                    if (e.target.closest('.meme-placeholder')) {
                        return; // Let meme interaction handle it
                    }
                    this.nextSlide();
                }
            });
        });
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                case ' ': // Spacebar
                case 'Enter':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                case 'Backspace':
                    e.preventDefault();
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
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.goToSlide(1); // Restart presentation
                    }
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
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = touchEndY - touchStartY;
            
            // Only handle horizontal swipes (not vertical scrolling)
            if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > swipeThreshold) {
                if (swipeDistanceX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    setupMemeInteractions() {
        // Add interactive effects to meme sections
        document.querySelectorAll('.meme-placeholder').forEach((meme, index) => {
            // Click interaction for memes
            meme.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerMemeEffect(meme, index + 1);
            });
            
            // Hover effects
            meme.addEventListener('mouseenter', () => {
                this.activateMemeHover(meme);
            });
            
            meme.addEventListener('mouseleave', () => {
                this.deactivateMemeHover(meme);
            });
            
            // Double-click for special effects
            meme.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.triggerSpecialMemeEffect(meme, index + 1);
            });
        });
    }
    
    activateMemeHover(meme) {
        const avatar = meme.querySelector('.hrithik-avatar');
        const bubble = meme.querySelector('.meme-bubble');
        
        if (avatar) {
            avatar.style.transform = 'scale(1.1)';
            avatar.style.transition = 'transform 0.3s ease';
        }
        
        if (bubble) {
            bubble.style.transform = 'scale(1.02)';
            bubble.style.transition = 'transform 0.3s ease';
        }
    }
    
    deactivateMemeHover(meme) {
        const avatar = meme.querySelector('.hrithik-avatar');
        const bubble = meme.querySelector('.meme-bubble');
        
        if (avatar) {
            avatar.style.transform = 'scale(1)';
        }
        
        if (bubble) {
            bubble.style.transform = 'scale(1)';
        }
    }
    
    triggerMemeEffect(meme, slideNumber) {
        const avatar = meme.querySelector('.hrithik-avatar');
        const bubble = meme.querySelector('.meme-bubble');
        
        // Add bounce effect
        if (avatar) {
            avatar.style.animation = 'bounce 0.8s ease-out';
            setTimeout(() => {
                avatar.style.animation = '';
            }, 800);
        }
        
        if (bubble) {
            bubble.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                bubble.style.animation = '';
            }, 600);
        }
        
        // Add sparkle effect
        this.addSparkleEffect(meme);
        
        // Play meme sound
        this.playMemeSound(slideNumber);
        
        // Show meme message
        this.showMemeMessage(slideNumber);
    }
    
    triggerSpecialMemeEffect(meme, slideNumber) {
        // More dramatic effect for double-click
        meme.style.animation = 'pulse 0.5s ease-out, bounce 0.8s ease-out 0.5s';
        
        // Create multiple sparkle bursts
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.addSparkleEffect(meme);
            }, i * 200);
        }
        
        // Play special sound sequence
        this.playSpecialMemeSound();
        
        // Show special message
        this.showSpecialMemeMessage(slideNumber);
        
        setTimeout(() => {
            meme.style.animation = '';
        }, 1300);
    }
    
    addSparkleEffect(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#FF6B35', '#2C3E50', '#8B6F47', '#FFD700', '#4CAF50'];
        const sparkleCount = 12;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${rect.left + Math.random() * rect.width}px;
                    top: ${rect.top + Math.random() * rect.height}px;
                    animation: sparkle-fall 1.5s ease-out forwards;
                `;
                document.body.appendChild(sparkle);
                
                setTimeout(() => sparkle.remove(), 1500);
            }, i * 50);
        }
    }
    
    playMemeSound(slideNumber) {
        // Create contextual audio feedback
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Different tones for different slides
                const frequencies = [800, 600, 900, 700, 750, 650, 850, 720, 680, 900];
                const frequency = frequencies[slideNumber - 1] || 800;
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(frequency * 1.2, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log('Audio not available');
            }
        }
    }
    
    playSpecialMemeSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Play ascending sequence
                [600, 700, 800, 900].forEach((freq, index) => {
                    setTimeout(() => {
                        const oscillator = audioContext.createOscillator();
                        const gainNode = audioContext.createGain();
                        
                        oscillator.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                        
                        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                        
                        oscillator.start(audioContext.currentTime);
                        oscillator.stop(audioContext.currentTime + 0.2);
                    }, index * 100);
                });
            } catch (e) {
                console.log('Audio not available');
            }
        }
    }
    
    showMemeMessage(slideNumber) {
        const messages = {
            1: 'Ready to overstep! 🔥',
            2: 'Chaloge humare saath? 🤝',
            3: 'BAN JAYEGA! Everything is possible! 🚀',
            4: 'Sneakerhead mode activated! 👟',
            5: 'These numbers are serious business! 📊',
            6: 'Perfect partnership incoming! 💫',
            7: 'So many opportunities! ✨',
            8: 'Success will come and stay! 🎯',
            9: 'All results BAN JAYEGA! 🏆',
            10: 'Let\'s make history together! 🔥'
        };
        
        const message = messages[slideNumber] || 'Hrithik approves! 👍';
        this.showToast(message);
    }
    
    showSpecialMemeMessage(slideNumber) {
        const specialMessages = {
            1: '🎭 Emotional excitement level: MAXIMUM! Ready to overstep like never before!',
            2: '🤝 Partnership vibes are STRONG! WLDD + Kunal = Unstoppable force!',
            3: '🔥 BAN JAYEGA energy is OFF THE CHARTS! Transformation complete!',
            4: '👟 ULTIMATE SNEAKERHEAD MODE! Born for this industry!',
            5: '📊 These achievements hit DIFFERENT! No jokes, only results!',
            6: '💫 Perfect partnership alignment achieved! Pretty please worked!',
            7: '✨ Emotional overload from opportunities! This is THE moment!',
            8: '🎯 Master plan confidence: UNSHAKEABLE! Success is guaranteed!',
            9: '🏆 Victory formation activated! All results BAN JAYEGA for sure!',
            10: '🔥 FINAL BOSS ENERGY! Let\'s overstep together and make history!'
        };
        
        const message = specialMessages[slideNumber] || '🌟 Special Hrithik energy activated!';
        this.showToast(message, true);
    }
    
    showToast(message, isSpecial = false) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${isSpecial ? 'linear-gradient(135deg, #FF6B35, #2C3E50)' : 'rgba(0, 0, 0, 0.8)'};
            color: white;
            padding: ${isSpecial ? '16px 24px' : '12px 20px'};
            border-radius: 12px;
            font-size: ${isSpecial ? '16px' : '14px'};
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: toast-slide-in 0.5s ease-out;
            transform: translateX(100%);
            line-height: 1.4;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            toast.style.transition = 'transform 0.5s ease-out';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 500);
        }, isSpecial ? 4000 : 2500);
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            const nextSlideNumber = this.currentSlide + 1;
            this.goToSlide(nextSlideNumber);
        } else {
            this.showCompletionMessage();
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            const prevSlideNumber = this.currentSlide - 1;
            this.goToSlide(prevSlideNumber);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            console.warn('Invalid slide number:', slideNumber);
            return;
        }
        
        const oldSlide = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Update slide visibility with animation
        this.updateSlideVisibility(oldSlide);
        
        // Update UI elements
        this.updateSlideCounter();
        this.updateButtonStates();
        
        // Trigger slide-specific actions
        setTimeout(() => {
            this.onSlideChange(slideNumber);
        }, 200);
    }
    
    updateSlideVisibility(oldSlideNumber) {
        // Remove active and prev classes from all slides
        this.slides.forEach((slide, index) => {
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
        // Update previous button
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        
        // Update next button
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
            
            if (this.currentSlide === this.totalSlides) {
                this.nextBtn.innerHTML = '🎉';
                this.nextBtn.title = 'Show Completion Message';
            } else {
                this.nextBtn.innerHTML = '→';
                this.nextBtn.title = 'Next Slide';
            }
        }
    }
    
    onSlideChange(slideNumber) {
        // Reset any existing animations
        this.resetAnimations();
        
        // Slide-specific entrance animations
        switch(slideNumber) {
            case 1:
                setTimeout(() => this.animateTitle(), 300);
                break;
            case 2:
                setTimeout(() => this.animateOriginStory(), 400);
                break;
            case 3:
                setTimeout(() => this.animateTransformation(), 300);
                break;
            case 4:
                setTimeout(() => this.animateSneakerStats(), 400);
                break;
            case 5:
                setTimeout(() => this.animatePowerMetrics(), 300);
                break;
            case 6:
                setTimeout(() => this.animateOpportunity(), 400);
                break;
            case 7:
                setTimeout(() => this.animateBringList(), 300);
                break;
            case 8:
                setTimeout(() => this.animateRoadmap(), 400);
                break;
            case 9:
                setTimeout(() => this.animateResults(), 300);
                break;
            case 10:
                setTimeout(() => this.finalSlideActions(), 400);
                break;
        }
        
        // Log slide navigation for debugging
        console.log(`📍 Now on slide ${slideNumber}: ${this.getSlideTitle(slideNumber)}`);
    }
    
    getSlideTitle(slideNumber) {
        const titles = {
            1: 'Title Slide',
            2: 'Origin Story - 2020',
            3: 'The Transformation',
            4: 'Sneakerhead Revelation',
            5: 'Current Superpowers',
            6: 'The 7-10 Opportunity',
            7: 'What I\'ll Bring',
            8: 'The Master Plan',
            9: 'Expected Results',
            10: 'Final Call to Action'
        };
        return titles[slideNumber] || `Slide ${slideNumber}`;
    }
    
    resetAnimations() {
        document.querySelectorAll('.slide h1, .slide h2, .stat-box, .power-metric, .result-card, .achievement-card, .bring-item, .roadmap-item, .metric, .opp-stat').forEach(el => {
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
            el.style.animation = '';
        });
    }
    
    animateTitle() {
        const titleSlide = document.querySelector('[data-slide="1"]');
        if (!titleSlide || !titleSlide.classList.contains('active')) return;
        
        const title = titleSlide.querySelector('h1');
        const subtitle = titleSlide.querySelector('h2');
        const logo = titleSlide.querySelector('.logo-placeholder');
        
        this.animateElement(title, 'fadeInUp', 100);
        this.animateElement(subtitle, 'fadeInUp', 500);
        this.animateElement(logo, 'scaleIn', 900);
    }
    
    animateOriginStory() {
        const metrics = document.querySelectorAll('[data-slide="2"] .metric');
        metrics.forEach((metric, index) => {
            this.animateElement(metric, 'scaleIn', 300 + (index * 200));
        });
    }
    
    animateTransformation() {
        const cards = document.querySelectorAll('[data-slide="3"] .achievement-card');
        cards.forEach((card, index) => {
            this.animateElement(card, 'slideInLeft', 200 + (index * 150));
        });
    }
    
    animateSneakerStats() {
        const statBoxes = document.querySelectorAll('[data-slide="4"] .stat-box');
        statBoxes.forEach((box, index) => {
            this.animateElement(box, 'scaleIn', 200 + (index * 300));
        });
    }
    
    animatePowerMetrics() {
        const powerMetrics = document.querySelectorAll('[data-slide="5"] .power-metric');
        powerMetrics.forEach((metric, index) => {
            this.animateElement(metric, 'slideInRight', 150 + (index * 150));
        });
    }
    
    animateOpportunity() {
        const equation = document.querySelector('[data-slide="6"] .equation');
        const stats = document.querySelectorAll('[data-slide="6"] .opp-stat');
        
        if (equation) this.animateElement(equation, 'fadeInUp', 200);
        stats.forEach((stat, index) => {
            this.animateElement(stat, 'scaleIn', 500 + (index * 150));
        });
    }
    
    animateBringList() {
        const items = document.querySelectorAll('[data-slide="7"] .bring-item');
        items.forEach((item, index) => {
            this.animateElement(item, 'slideInLeft', 200 + (index * 100));
        });
    }
    
    animateRoadmap() {
        const items = document.querySelectorAll('[data-slide="8"] .roadmap-item');
        items.forEach((item, index) => {
            this.animateElement(item, 'slideInRight', 150 + (index * 200));
        });
    }
    
    animateResults() {
        const resultCards = document.querySelectorAll('[data-slide="9"] .result-card');
        resultCards.forEach((card, index) => {
            this.animateElement(card, 'flipIn', 200 + (index * 200));
        });
    }
    
    animateElement(element, animationName, delay = 0) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(animationName);
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            element.style.opacity = '1';
            element.style.transform = 'none';
        }, delay);
    }
    
    getInitialTransform(animationName) {
        switch(animationName) {
            case 'fadeInUp': return 'translateY(30px)';
            case 'slideInLeft': return 'translateX(-50px)';
            case 'slideInRight': return 'translateX(50px)';
            case 'scaleIn': return 'scale(0.8)';
            case 'flipIn': return 'rotateY(90deg)';
            default: return 'translateY(20px)';
        }
    }
    
    finalSlideActions() {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.style.animation = 'pulse 2s infinite';
            
            // Add click handler for final CTA
            ctaButton.removeEventListener('click', this.handleFinalCTA);
            ctaButton.addEventListener('click', this.handleFinalCTA.bind(this));
        }
        
        // Animate contact info
        const contactItems = document.querySelectorAll('[data-slide="10"] .contact-item');
        contactItems.forEach((item, index) => {
            this.animateElement(item, 'fadeInUp', 200 + (index * 200));
        });
    }
    
    handleFinalCTA() {
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.textContent = 'Thank You! 🚀';
            ctaButton.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)';
            ctaButton.style.animation = 'none';
            ctaButton.style.transform = 'scale(1.1)';
            
            // Add confetti effect
            this.createConfettiExplosion();
            
            setTimeout(() => {
                this.showFinalMessage();
            }, 1000);
        }
    }
    
    createConfettiExplosion() {
        const colors = ['#FF6B35', '#2C3E50', '#8B6F47', '#FFD700', '#4CAF50', '#E91E63'];
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    z-index: 9999;
                    pointer-events: none;
                    border-radius: 2px;
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: confetti-fall 3s linear forwards;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }
    
    showFinalMessage() {
        const message = this.createMessageOverlay(
            '🎉 BAN JAYEGA! 🎉',
            'Thank you for experiencing Kunal\'s pitch! Ready to make 7-10 the biggest Indian sneaker brand together! Let\'s overstep the competition! 🔥👟',
            ['#FF6B35', '#2C3E50']
        );
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    showCompletionMessage() {
        const message = this.createMessageOverlay(
            '✨ Presentation Complete! ✨',
            'Kunal is ready to overstep the game with 7-10! From meme marketing to sneaker culture, this partnership will be legendary! 🚀',
            ['#8B6F47', '#FF6B35']
        );
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    createMessageOverlay(title, subtitle, colors) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.5s ease-out;
            backdrop-filter: blur(10px);
        `;
        
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});
            color: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 600px;
            margin: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            animation: scaleIn 0.6s ease-out 0.2s both;
        `;
        
        messageBox.innerHTML = `
            <h2 style="font-size: 36px; margin: 0 0 20px 0; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${title}</h2>
            <p style="font-size: 18px; margin: 0; line-height: 1.6; opacity: 0.95;">${subtitle}</p>
            <div style="margin-top: 30px;">
                <small style="opacity: 0.8; font-size: 14px;">Click anywhere to dismiss</small>
            </div>
        `;
        
        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
        
        // Click to dismiss
        overlay.addEventListener('click', () => overlay.remove());
        
        return overlay;
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not available:', err);
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

// Add required animations dynamically
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
        
        @keyframes flipIn {
            from {
                opacity: 0;
                transform: rotateY(90deg);
            }
            to {
                opacity: 1;
                transform: rotateY(0);
            }
        }
        
        @keyframes sparkle-fall {
            0% { 
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% { 
                transform: translateY(150px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes confetti-fall {
            0% { 
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
            }
            100% { 
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes toast-slide-in {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
        }
        
        .slide {
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .meme-placeholder {
            cursor: pointer;
            user-select: none;
        }
        
        .meme-placeholder:active {
            transform: scale(0.98);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Kunal\'s 7-10 Marketing Head Pitch...');
    
    // Add custom animations
    addAnimations();
    
    // Initialize presentation manager
    window.presentationManager = new PresentationManager();
    
    // Welcome message
    console.log(`
    🎯 KUNAL'S 7-10 PITCH READY!
    
    🎮 Controls:
    • Click anywhere or press Space/Enter to advance
    • Arrow keys for navigation  
    • Click memes for interactive effects
    • Double-click memes for special effects
    • F or Ctrl+F for fullscreen
    • Ctrl+R to restart presentation
    • Escape to exit fullscreen
    
    📱 Mobile: Swipe left/right to navigate
    
    🔥 Ready to overstep the game with 7-10! 
    `);
});

// Utility functions for debugging
window.debugPresentation = {
    getCurrentSlide: () => window.presentationManager?.getCurrentSlide(),
    jumpTo: (slide) => window.presentationManager?.jumpToSlide(slide),
    totalSlides: () => window.presentationManager?.getTotalSlides(),
    triggerMeme: (slideNum) => {
        const meme = document.querySelector(`[data-slide="${slideNum}"] .meme-placeholder`);
        if (meme && window.presentationManager) {
            window.presentationManager.triggerMemeEffect(meme, slideNum);
        }
    },
    showCompletion: () => window.presentationManager?.showCompletionMessage()
};