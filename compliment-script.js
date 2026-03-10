// Compliment messages
const messages = [
    "We fight a lot… but somehow I still love you more every time.",
    "I'm really lucky to have you in my life.",
    "Life feels lighter when you're around.",
    "You make ordinary days feel special.",
    "Our chaos together is honestly unmatched.",
    "I still can't believe we survive our own ideas.",
    "You understand me even when I don't explain anything.",
    "Somehow we always turn simple plans into chaos.",
    "You make my life a little brighter just by being in it.",
    "If chaos had a face, it would probably be us.",
    "Thank you for always being there for me.",
    "Every apartment we've lived in has definitely heard us arguing… but I love you, Shossely.",
    "I'm really glad you're in my life.",
    "Our conversations make absolutely no sense… and I love that.",
    "Some of my favorite memories include you.",
    "I feel like we would survive a zombie apocalypse together.",
    "You make life more fun without even trying.",
    "I'm really grateful that I got you as my roommate.",
    "You're not just my roommate… you're my secret keeper and partner in chaos.",
    "Even on the messy days, I'm still glad it's you.",
    "Honestly… life would be boring without you."
];

// Get elements
const complimentButton = document.querySelector('.compliment-button');
const messageCard = document.querySelector('.message-card');
const messageText = document.querySelector('.message-text');
const backButton = document.querySelector('.back-button');

// Track if it's the first click
let isFirstClick = true;
let usedMessages = [];

// Button click handlers
complimentButton.addEventListener('click', () => {
    // Add click animation to button
    complimentButton.classList.add('clicked');
    setTimeout(() => {
        complimentButton.classList.remove('clicked');
    }, 300);
    
    // Show message
    showMessage();
});

// Back button functionality
backButton.addEventListener('click', () => {
    window.location.href = 'surprise.html';
});

// Show random message
function showMessage() {
    let selectedMessage;
    
    if (isFirstClick) {
        // First click always shows the first message
        selectedMessage = messages[0];
        isFirstClick = false;
        usedMessages.push(0);
    } else {
        // Get random message that hasn't been used recently
        selectedMessage = getRandomMessage();
    }
    
    // Update message text
    messageText.textContent = selectedMessage;
    
    // Show card with animation
    if (messageCard.classList.contains('hidden')) {
        messageCard.classList.remove('hidden');
        // Trigger reflow to restart animation
        messageCard.offsetHeight;
        messageCard.style.animation = 'none';
        setTimeout(() => {
            messageCard.style.animation = 'popIn 0.6s ease-out';
        }, 10);
    } else {
        // Card is already visible, just animate the text change
        messageText.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
            messageText.textContent = selectedMessage;
            messageText.style.animation = 'fadeIn 0.4s ease-out';
        }, 200);
    }
    
    // Add a subtle shake to the card
    setTimeout(() => {
        messageCard.style.animation = 'gentleShake 0.5s ease-out';
    }, 600);
}

// Get random message avoiding recent repeats
function getRandomMessage() {
    let availableMessages = [];
    
    // If we've used all messages, reset the used list (keep last 3 to avoid immediate repeats)
    if (usedMessages.length >= messages.length - 3) {
        usedMessages = usedMessages.slice(-3);
    }
    
    // Get messages that haven't been used recently
    for (let i = 0; i < messages.length; i++) {
        if (!usedMessages.includes(i)) {
            availableMessages.push(i);
        }
    }
    
    // Pick random from available
    const randomIndex = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    usedMessages.push(randomIndex);
    
    return messages[randomIndex];
}

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes gentleShake {
        0%, 100% { transform: rotate(-1deg) scale(1); }
        25% { transform: rotate(1deg) scale(1.02); }
        75% { transform: rotate(-2deg) scale(1.02); }
    }
`;
document.head.appendChild(style);

// Add subtle parallax effect to background decorations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.sparkle, .heart, .confetti-dot');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index % 4) * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add random gentle animations to background elements
setInterval(() => {
    const hearts = document.querySelectorAll('.heart');
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    randomHeart.style.animation = 'none';
    setTimeout(() => {
        randomHeart.style.animation = 'floatHeart 4s infinite ease-in-out, heartPulse 0.8s ease-out';
    }, 10);
}, 5000);

// Add heart pulse animation
const heartPulseStyle = document.createElement('style');
heartPulseStyle.textContent = `
    @keyframes heartPulse {
        0% { transform: rotate(-45deg) scale(1); }
        50% { transform: rotate(-45deg) scale(1.3); }
        100% { transform: rotate(-45deg) scale(1); }
    }
`;
document.head.appendChild(heartPulseStyle);