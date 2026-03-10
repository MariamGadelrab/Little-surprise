// Get all gift boxes
const giftBoxes = document.querySelectorAll('.gift-box');

// Add click event to each gift box
giftBoxes.forEach(giftBox => {
    giftBox.addEventListener('click', function() {
        // Prevent multiple clicks
        if (this.classList.contains('opening')) return;
        
        // Get the link from data attribute
        const link = this.dataset.link;
        
        // Add opening animation class
        this.classList.add('opening');
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = link;
        }, 800);
    });
});

// Add hover sound effect (optional - can be enhanced with actual sound)
giftBoxes.forEach(giftBox => {
    giftBox.addEventListener('mouseenter', function() {
        // Add a subtle scale animation on hover
        this.style.transition = 'transform 0.3s ease';
    });
});
