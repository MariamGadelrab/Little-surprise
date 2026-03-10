// Track blown out candles
let blownCandles = 0;
const totalCandles = 3;

// Get all candle elements
const candles = document.querySelectorAll('.candle');
const successMessage = document.querySelector('.success-message');
const surpriseButton = document.querySelector('.surprise-button');
const helperText = document.querySelector('.helper-text');

// Add click event to each candle
candles.forEach(candle => {
    candle.addEventListener('click', () => {
        if (!candle.classList.contains('blown-out')) {
            blowOutCandle(candle);
        }
    });
});

// Blow out candle function
function blowOutCandle(candle) {
    candle.classList.add('blown-out');
    blownCandles++;
    
    // Check if all candles are blown out
    if (blownCandles === totalCandles) {
        setTimeout(() => {
            allCandlesBlown();
        }, 500);
    }
}

// All candles blown function
function allCandlesBlown() {
    // Hide helper text
    helperText.style.opacity = '0';
    
    // Start confetti
    startConfetti();
    
    // Show success message
    setTimeout(() => {
        successMessage.classList.remove('hidden');
    }, 300);
    
    // Show surprise button
    setTimeout(() => {
        surpriseButton.classList.remove('hidden');
    }, 1500);
    
    // Stop confetti after 3 seconds
    setTimeout(() => {
        stopConfetti();
    }, 3000);
}

// Confetti animation
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiPieces = [];
let animationId;
let isConfettiActive = false;

// Pastel colors for confetti
const confettiColors = ['#FF8FAB', '#FFC2D1', '#FFE5EC', '#CDB4DB', '#BDE0FE', '#FFF3B0'];

class ConfettiPiece {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startConfetti() {
    if (isConfettiActive) return;
    isConfettiActive = true;
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        confettiPieces.push(new ConfettiPiece());
    }
    
    animateConfetti();
}

function animateConfetti() {
    if (!isConfettiActive) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach(piece => {
        piece.update();
        piece.draw();
    });
    
    animationId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
    isConfettiActive = false;
    cancelAnimationFrame(animationId);
    
    // Fade out confetti
    let opacity = 1;
    const fadeOut = setInterval(() => {
        opacity -= 0.05;
        canvas.style.opacity = opacity;
        
        if (opacity <= 0) {
            clearInterval(fadeOut);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.opacity = 1;
            confettiPieces = [];
        }
    }, 50);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Surprise button click - navigate to puzzle.html
surpriseButton.addEventListener('click', () => {
    window.location.href = 'puzzle.html';
});
