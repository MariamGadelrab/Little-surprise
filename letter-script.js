// Get elements
const envelope = document.querySelector('.envelope');
const openButton = document.querySelector('.open-button');
const letterCard = document.querySelector('.letter-card');
const backButton = document.querySelector('.back-button');

// Track if envelope is opened
let isOpened = false;

// Open button click handler
openButton.addEventListener('click', () => {
    if (!isOpened) {
        openEnvelope();
    }
});

// Envelope click handler (alternative way to open)
envelope.addEventListener('click', () => {
    if (!isOpened) {
        openEnvelope();
    }
});

// Open envelope function
function openEnvelope() {
    isOpened = true;
    
    // Add opening animation to envelope
    envelope.classList.add('opening');
    
    // Hide the open button
    setTimeout(() => {
        openButton.classList.add('hidden');
    }, 400);
    
    // Show the letter card after envelope animation
    setTimeout(() => {
        letterCard.classList.remove('hidden');
        
        // Show back button after letter appears
        setTimeout(() => {
            backButton.classList.remove('hidden');
        }, 800);
    }, 800);
}

// Back button functionality
backButton.addEventListener('click', () => {
    window.location.href = 'surprise.html';
});

// Add subtle parallax effect to background decorations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.sparkle, .heart');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index % 3) * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add random gentle animations to hearts
setInterval(() => {
    const hearts = document.querySelectorAll('.heart');
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    randomHeart.style.animation = 'none';
    setTimeout(() => {
        randomHeart.style.animation = 'floatHeart 5s infinite ease-in-out, heartPulse 0.8s ease-out';
    }, 10);
}, 6000);

// Add heart pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes heartPulse {
        0% { transform: rotate(-45deg) scale(1); }
        50% { transform: rotate(-45deg) scale(1.4); }
        100% { transform: rotate(-45deg) scale(1); }
    }
`;
document.head.appendChild(style);