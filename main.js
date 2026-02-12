// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    createFloatingHearts();
    initializeGame();
    initializeLetter();
    initializeGallery();
    initializeProposal();
    initializeMusicControl();
});

// ========== FLOATING HEARTS BACKGROUND ==========
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsBackground');
    const heartSymbols = ['💕', '💖', '💗', '💝', '💘', '❤️'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        heart.style.fontSize = (Math.random() * 15 + 20) + 'px';
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 10000);
    }, 800);
}

// ========== START SECTION ==========
const startBtn = document.getElementById('startBtn');
const startSection = document.getElementById('startSection');
const gameSection = document.getElementById('gameSection');
const bgMusic = document.getElementById('bgMusic');

startBtn.addEventListener('click', function() {
    // Play music
    bgMusic.play().catch(err => console.log('Music playback failed:', err));
    
    // Transition to game
    transitionToSection(startSection, gameSection);
});

// ========== SECTION TRANSITIONS ==========
function transitionToSection(currentSection, nextSection) {
    currentSection.style.opacity = '0';
    
    setTimeout(() => {
        currentSection.classList.remove('active');
        nextSection.classList.add('active');
        
        setTimeout(() => {
            nextSection.style.opacity = '1';
        }, 50);
    }, 800);
}

// ========== GAME SECTION (HEART CHASER) ==========
function initializeGame() {
    const hookContainer = document.getElementById('hookContainer');
    const movingHeart = document.getElementById('movingHeart');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const seizeBtn = document.getElementById('seizeBtn');
    const letterSection = document.getElementById('letterSection');
    
    let hookPosition = 50; // percentage
    let isGrabbing = false;
    
    // Move left
    leftBtn.addEventListener('click', function() {
        if (!isGrabbing && hookPosition > 15) {
            hookPosition -= 15;
            hookContainer.style.left = hookPosition + '%';
        }
    });
    
    // Move right
    rightBtn.addEventListener('click', function() {
        if (!isGrabbing && hookPosition < 85) {
            hookPosition += 15;
            hookContainer.style.left = hookPosition + '%';
        }
    });
    
    // Seize the heart
    seizeBtn.addEventListener('click', function() {
        if (isGrabbing) return;
        
        isGrabbing = true;
        leftBtn.disabled = true;
        rightBtn.disabled = true;
        seizeBtn.disabled = true;
        
        // Descend
        hookContainer.classList.add('descending');
        
        setTimeout(() => {
            // Grab
            hookContainer.classList.add('grabbing');
            
            // Check if heart is caught
            const heartRect = movingHeart.getBoundingClientRect();
            const hookRect = hookContainer.getBoundingClientRect();
            
            const hookCenterX = hookRect.left + hookRect.width / 2;
            const heartLeft = heartRect.left;
            const heartRight = heartRect.right;
            
            const isCaught = hookCenterX >= heartLeft && hookCenterX <= heartRight;
            
            if (isCaught) {
                // Success! Caught the heart
                movingHeart.style.opacity = '0';
                
                setTimeout(() => {
                    // Ascend with heart
                    hookContainer.classList.remove('descending');
                    
                    setTimeout(() => {
                        // Transition to letter section
                        transitionToSection(gameSection, letterSection);
                        
                        // Reset game
                        hookContainer.classList.remove('grabbing');
                        movingHeart.style.opacity = '1';
                        hookPosition = 50;
                        hookContainer.style.left = '50%';
                        isGrabbing = false;
                        leftBtn.disabled = false;
                        rightBtn.disabled = false;
                        seizeBtn.disabled = false;
                    }, 1000);
                }, 800);
            } else {
                // Missed! Reset
                setTimeout(() => {
                    hookContainer.classList.remove('descending', 'grabbing');
                    isGrabbing = false;
                    leftBtn.disabled = false;
                    rightBtn.disabled = false;
                    seizeBtn.disabled = false;
                }, 1500);
            }
        }, 800);
    });
}

// ========== LETTER SECTION ==========
function initializeLetter() {
    const envelope = document.getElementById('envelope');
    const letterPaper = document.getElementById('letterPaper');
    const continueToGallery = document.getElementById('continueToGallery');
    const gallerySection = document.getElementById('gallerySection');
    const letterSection = document.getElementById('letterSection');
    
    // Open envelope on click
    envelope.addEventListener('click', function() {
        envelope.classList.add('open');
        
        setTimeout(() => {
            letterPaper.classList.add('show');
            envelope.style.display = 'none';
        }, 800);
    });
    
    // Continue to gallery
    continueToGallery.addEventListener('click', function() {
        transitionToSection(letterSection, gallerySection);
    });
}

// ========== GALLERY SECTION ==========
function initializeGallery() {
    const continueToProposal = document.getElementById('continueToProposal');
    const gallerySection = document.getElementById('gallerySection');
    const proposalSection = document.getElementById('proposalSection');
    
    continueToProposal.addEventListener('click', function() {
        transitionToSection(gallerySection, proposalSection);
    });
}

// ========== PROPOSAL SECTION ==========
function initializeProposal() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const celebrationMessage = document.getElementById('celebrationMessage');
    const proposalButtons = document.querySelector('.proposal-buttons');
    
    // Yes button - celebration!
    yesBtn.addEventListener('click', function() {
        proposalButtons.style.display = 'none';
        celebrationMessage.classList.add('show');
        
        // Create love shower
        createLoveShower();
    });
    
    // No button - runs away!
    noBtn.addEventListener('mouseenter', function() {
        const container = proposalButtons;
        const containerRect = container.getBoundingClientRect();
        
        // Random position within container
        const maxX = containerRect.width - noBtn.offsetWidth;
        const maxY = containerRect.height - noBtn.offsetHeight;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        noBtn.style.position = 'absolute';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    });
    
    // Also handle touch for mobile
    noBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const container = proposalButtons;
        const containerRect = container.getBoundingClientRect();
        
        const maxX = containerRect.width - noBtn.offsetWidth;
        const maxY = containerRect.height - noBtn.offsetHeight;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        noBtn.style.position = 'absolute';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    });
}

// Create love shower animation
function createLoveShower() {
    const loveSymbols = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '💞'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const love = document.createElement('div');
            love.className = 'floating-heart';
            love.textContent = loveSymbols[Math.floor(Math.random() * loveSymbols.length)];
            love.style.position = 'fixed';
            love.style.top = '-50px';
            love.style.left = Math.random() * 100 + '%';
            love.style.fontSize = (Math.random() * 20 + 30) + 'px';
            love.style.zIndex = '9999';
            
            document.body.appendChild(love);
            
            love.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0.5 }
            ], {
                duration: Math.random() * 2000 + 3000,
                easing: 'linear'
            });
            
            setTimeout(() => love.remove(), 5000);
        }, i * 100);
    }
}

// ========== MUSIC CONTROL ==========
function initializeMusicControl() {
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    let isPlaying = true; // Starts playing after start button
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            musicToggle.classList.remove('playing');
        } else {
            bgMusic.play();
            musicIcon.textContent = '🔊';
            musicToggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
    
    // Set initial state after music starts
    bgMusic.addEventListener('play', function() {
        musicToggle.classList.add('playing');
    });
}