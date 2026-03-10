// Puzzle configuration
const GRID_SIZE = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;
const IMAGE_PATH = 'Images/puzzle-photo.jpg';

// Get elements
const puzzleGrid = document.getElementById('puzzle-grid');
const successMessage = document.querySelector('.success-message');
const continueButton = document.querySelector('.continue-button');

// Puzzle state - array representing current piece order
let puzzleState = [];
let correctPositions = 0;

// Initialize puzzle
function initPuzzle() {
    // Create array of piece positions (0-15)
    const positions = [];
    for (let i = 0; i < TOTAL_PIECES; i++) {
        positions.push(i);
    }
    
    // Shuffle positions
    shuffleArray(positions);
    
    // Initialize puzzle state with shuffled positions
    puzzleState = [...positions];
    
    // Render the puzzle
    renderPuzzle();
    
    // Add drag and drop event listeners
    addDragAndDropListeners();
}

// Render the entire puzzle based on current state
function renderPuzzle() {
    // Clear the grid
    puzzleGrid.innerHTML = '';
    
    // Create pieces based on current state
    for (let gridPosition = 0; gridPosition < TOTAL_PIECES; gridPosition++) {
        const imagePosition = puzzleState[gridPosition];
        const piece = createPuzzlePiece(imagePosition, gridPosition);
        puzzleGrid.appendChild(piece);
    }
    
    // Check which pieces are correct after rendering
    checkAllPieces();
}

// Create a puzzle piece
function createPuzzlePiece(imagePosition, gridPosition) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.draggable = true;
    
    // Calculate background position for the image
    const row = Math.floor(imagePosition / GRID_SIZE);
    const col = imagePosition % GRID_SIZE;
    
    piece.style.backgroundImage = `url('${IMAGE_PATH}')`;
    piece.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
    
    // Store data attributes
    piece.dataset.imagePosition = imagePosition;
    piece.dataset.gridPosition = gridPosition;
    
    return piece;
}

// Check all pieces for correctness
function checkAllPieces() {
    const pieces = puzzleGrid.querySelectorAll('.puzzle-piece');
    correctPositions = 0;
    
    pieces.forEach((piece, index) => {
        const imagePosition = parseInt(piece.dataset.imagePosition);
        const gridPosition = parseInt(piece.dataset.gridPosition);
        
        // A piece is correct if its image position matches its grid position
        if (imagePosition === gridPosition) {
            if (!piece.classList.contains('correct')) {
                piece.classList.add('correct');
                piece.draggable = false;
                // Add animation for newly correct pieces
                piece.style.animation = 'correctPiece 0.5s ease-out';
                setTimeout(() => {
                    piece.style.animation = '';
                }, 500);
            }
            correctPositions++;
        } else {
            // Remove correct class if piece is no longer in correct position
            if (piece.classList.contains('correct')) {
                piece.classList.remove('correct');
                piece.draggable = true;
            }
        }
    });
    
    // Check if puzzle is complete
    if (correctPositions === TOTAL_PIECES) {
        setTimeout(() => {
            puzzleComplete();
        }, 500);
    }
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
let draggedGridPosition = -1;

function addDragAndDropListeners() {
    // Add event listeners to the grid container for event delegation
    puzzleGrid.addEventListener('dragstart', handleDragStart);
    puzzleGrid.addEventListener('dragend', handleDragEnd);
    puzzleGrid.addEventListener('dragover', handleDragOver);
    puzzleGrid.addEventListener('drop', handleDrop);
    puzzleGrid.addEventListener('dragenter', handleDragEnter);
    puzzleGrid.addEventListener('dragleave', handleDragLeave);
    
    // Touch events for mobile
    puzzleGrid.addEventListener('touchstart', handleTouchStart, { passive: false });
    puzzleGrid.addEventListener('touchmove', handleTouchMove, { passive: false });
    puzzleGrid.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function handleDragStart(e) {
    const piece = e.target.closest('.puzzle-piece');
    if (!piece || piece.classList.contains('correct')) {
        e.preventDefault();
        return false;
    }
    
    draggedPiece = piece;
    draggedGridPosition = parseInt(piece.dataset.gridPosition);
    piece.classList.add('dragging');
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', piece.outerHTML);
    
    // Create drag image
    const dragImage = piece.cloneNode(true);
    dragImage.style.transform = 'rotate(5deg)';
    e.dataTransfer.setDragImage(dragImage, 50, 50);
}

function handleDragEnd(e) {
    const piece = e.target.closest('.puzzle-piece');
    if (piece && piece.classList.contains('dragging')) {
        piece.classList.remove('dragging');
    }
    
    // Clean up any visual effects
    const allPieces = puzzleGrid.querySelectorAll('.puzzle-piece');
    allPieces.forEach(p => p.classList.remove('drag-over'));
    
    draggedPiece = null;
    draggedGridPosition = -1;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const piece = e.target.closest('.puzzle-piece');
    if (piece && piece !== draggedPiece && !piece.classList.contains('correct')) {
        piece.classList.add('drag-over');
    }
    
    return false;
}

function handleDragEnter(e) {
    e.preventDefault();
    
    const piece = e.target.closest('.puzzle-piece');
    if (piece && piece !== draggedPiece && !piece.classList.contains('correct')) {
        piece.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    const piece = e.target.closest('.puzzle-piece');
    if (piece) {
        piece.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const targetPiece = e.target.closest('.puzzle-piece');
    if (targetPiece) {
        targetPiece.classList.remove('drag-over');
    }
    
    if (draggedPiece && targetPiece && draggedPiece !== targetPiece && 
        !targetPiece.classList.contains('correct') && 
        !draggedPiece.classList.contains('correct')) {
        
        const targetGridPosition = parseInt(targetPiece.dataset.gridPosition);
        swapPieces(draggedGridPosition, targetGridPosition);
    }
    
    return false;
}

// Touch support for mobile devices
let touchStartPiece = null;
let touchStartGridPosition = -1;
let touchOffset = { x: 0, y: 0 };

function handleTouchStart(e) {
    const piece = e.target.closest('.puzzle-piece');
    if (!piece || piece.classList.contains('correct')) return;
    
    touchStartPiece = piece;
    touchStartGridPosition = parseInt(piece.dataset.gridPosition);
    piece.classList.add('dragging');
    
    const touch = e.touches[0];
    const rect = piece.getBoundingClientRect();
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
    const allPieces = puzzleGrid.querySelectorAll('.puzzle-piece');
    allPieces.forEach(p => p.classList.remove('drag-over'));
    
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
    const allPieces = puzzleGrid.querySelectorAll('.puzzle-piece');
    allPieces.forEach(p => p.classList.remove('drag-over'));
    
    // Perform swap if valid target
    if (targetPiece && targetPiece !== piece && 
        !targetPiece.classList.contains('correct') && 
        !piece.classList.contains('correct')) {
        
        const targetGridPosition = parseInt(targetPiece.dataset.gridPosition);
        swapPieces(touchStartGridPosition, targetGridPosition);
    }
    
    touchStartPiece = null;
    touchStartGridPosition = -1;
    e.preventDefault();
}

// Swap two pieces in the puzzle state and re-render
function swapPieces(gridPos1, gridPos2) {
    // Swap pieces in the state array
    [puzzleState[gridPos1], puzzleState[gridPos2]] = [puzzleState[gridPos2], puzzleState[gridPos1]];
    
    // Re-render the entire puzzle
    renderPuzzle();
    
    // Re-add event listeners since we recreated the DOM elements
    addDragAndDropListeners();
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
