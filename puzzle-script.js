// Puzzle configuration
const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const IMAGE_PATH = 'images/puzzle-photo.jpg';

// Get elements
const puzzleGrid = document.getElementById('puzzle-grid');
const successMessage = document.querySelector('.success-message');
const continueButton = document.querySelector('.continue-button');

// Puzzle state
let pieces = [];
let correctPositions = 0;

// Initialize puzzle
function initPuzzle() {
    // Create array of piece positions
    const positions = [];
    for (let i = 0; i < TOTAL_PIECES; i++) {
        positions.push(i);
    }
    
    // Shuffle positions
    shuffleArray(positions);
    
    // Create puzzle pieces
    for (let i = 0; i < TOTAL_PIECES; i++) {
        const piece = createPuzzlePiece(positions[i], i);
        pieces.push(piece);
        puzzleGrid.appendChild(piece);
    }
    
    // Add drag and drop event listeners
    addDragAndDropListeners();
}

// Create a puzzle piece
function createPuzzlePiece(imagePosition, gridPosition) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.draggable = true;
    
    // Calculate background position
    const row = Math.floor(imagePosition / GRID_SIZE);
    const col = imagePosition % GRID_SIZE;
    
    piece.style.backgroundImage = `url('${IMAGE_PATH}')`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    
    // Store data
    piece.dataset.correctPosition = imagePosition;
    piece.dataset.currentPosition = gridPosition;
    
    return piece;
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Drag and drop functionality
let draggedPiece = null;
let draggedOverPiece = null;

function addDragAndDropListeners() {
    pieces.forEach(piece => {
        // HTML5 drag and drop events
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragenter', handleDragEnter);
        piece.addEventListener('dragleave', handleDragLeave);
        
        // Touch events for mobile
        piece.addEventListener('touchstart', handleTouchStart, { passive: false });
        piece.addEventListener('touchmove', handleTouchMove, { passive: false });
        piece.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
}

function handleDragStart(e) {
    if (this.classList.contains('correct')) {
        e.preventDefault();
        return false;
    }
    
    draggedPiece = this;
    this.classList.add('dragging');
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    
    // Create drag image
    const dragImage = this.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    e.dataTransfer.setDragImage(dragImage, 50, 50);
}

function handleDragEnd(e) {
    if (this.classList.contains('dragging')) {
        this.classList.remove('dragging');
    }
    
    // Clean up any visual effects
    pieces.forEach(piece => {
        piece.classList.remove('drag-over');
    });
    
    draggedPiece = null;
    draggedOverPiece = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (this !== draggedPiece && !this.classList.contains('correct')) {
        this.classList.add('drag-over');
    }
    
    return false;
}

function handleDragEnter(e) {
    e.preventDefault();
    
    if (this !== draggedPiece && !this.classList.contains('correct')) {
        draggedOverPiece = this;
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
    
    if (this === draggedOverPiece) {
        draggedOverPiece = null;
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.classList.remove('drag-over');
    
    if (draggedPiece && draggedPiece !== this && 
        !this.classList.contains('correct') && 
        !draggedPiece.classList.contains('correct')) {
        // Swap pieces
        swapPieces(draggedPiece, this);
    }
    
    return false;
}

// Touch support for mobile devices
let touchStartPiece = null;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
    if (this.classList.contains('correct')) return;
    
    touchStartPiece = this;
    this.classList.add('dragging');
    
    const touch = e.touches[0];
    const rect = this.getBoundingClientRect();
    touchOffset.x = touch.clientX - rect.left;
    touchOffset.y = touch.clientY - rect.top;
    
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!touchStartPiece) return;
    
    const touch = e.touches[0];
    const piece = touchStartPiece;
    
    // Move the piece with the touch
    piece.style.position = 'fixed';
    piece.style.left = (touch.clientX - touchOffset.x) + 'px';
    piece.style.top = (touch.clientY - touchOffset.y) + 'px';
    piece.style.zIndex = '1000';
    
    // Find element under touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetPiece = elementBelow?.closest('.puzzle-piece');
    
    // Remove previous drag-over effects
    pieces.forEach(p => p.classList.remove('drag-over'));
    
    // Add drag-over effect to target
    if (targetPiece && targetPiece !== piece && !targetPiece.classList.contains('correct')) {
        targetPiece.classList.add('drag-over');
    }
    
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!touchStartPiece) return;
    
    const piece = touchStartPiece;
    const touch = e.changedTouches[0];
    
    // Reset piece position
    piece.style.position = '';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.zIndex = '';
    piece.classList.remove('dragging');
    
    // Find target piece
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetPiece = elementBelow?.closest('.puzzle-piece');
    
    // Clean up drag-over effects
    pieces.forEach(p => p.classList.remove('drag-over'));
    
    // Perform swap if valid target
    if (targetPiece && targetPiece !== piece && 
        !targetPiece.classList.contains('correct') && 
        !piece.classList.contains('correct')) {
        swapPieces(piece, targetPiece);
    }
    
    touchStartPiece = null;
    e.preventDefault();
}

function swapPieces(piece1, piece2) {
    // Get current positions
    const pos1 = parseInt(piece1.dataset.currentPosition);
    const pos2 = parseInt(piece2.dataset.currentPosition);
    
    // Swap in DOM
    const parent = piece1.parentNode;
    const piece1Next = piece1.nextSibling;
    const piece2Next = piece2.nextSibling;
    
    if (piece1Next === piece2) {
        parent.insertBefore(piece2, piece1);
    } else if (piece2Next === piece1) {
        parent.insertBefore(piece1, piece2);
    } else {
        parent.insertBefore(piece1, piece2Next);
        parent.insertBefore(piece2, piece1Next);
    }
    
    // Update positions
    piece1.dataset.currentPosition = pos2;
    piece2.dataset.currentPosition = pos1;
    
    // Check if pieces are correct
    checkPiece(piece1);
    checkPiece(piece2);
    
    // Check if puzzle is complete
    checkPuzzleComplete();
}

function checkPiece(piece) {
    const correctPos = parseInt(piece.dataset.correctPosition);
    const currentPos = parseInt(piece.dataset.currentPosition);
    
    if (correctPos === currentPos && !piece.classList.contains('correct')) {
        piece.classList.add('correct');
        piece.draggable = false;
        correctPositions++;
    }
}

function checkPuzzleComplete() {
    if (correctPositions === TOTAL_PIECES) {
        setTimeout(() => {
            puzzleComplete();
        }, 500);
    }
}

function puzzleComplete() {
    // Start confetti
    startConfetti();
    
    // Show success message
    setTimeout(() => {
        successMessage.classList.remove('hidden');
    }, 300);
    
    // Show continue button
    setTimeout(() => {
        continueButton.classList.remove('hidden');
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

// Continue button click
continueButton.addEventListener('click', () => {
    window.location.href = 'surprise.html';
});

// Initialize puzzle when page loads
window.addEventListener('load', () => {
    initPuzzle();
});
