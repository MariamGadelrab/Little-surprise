// Plans data and state management
const defaultPlans = [
    { id: 0, text: "Went to the cinema together for the first time 🎬", completed: true },
    { id: 1, text: "Weekly taste tests together 🍩", completed: false },
    { id: 2, text: "Write each other a letter every month 💌", completed: false },
    { id: 3, text: "Have a playdough date 🎨", completed: false },
    { id: 4, text: "Decorate the Komodino together 🎨", completed: false },
    { id: 5, text: "Go to a rug-making workshop together 🧶", completed: false },
    { id: 6, text: "Travel somewhere together ✈️", completed: false },
    { id: 7, text: "Take chaotic photos together 📸", completed: false },
    { id: 8, text: "Keep adding to this list forever 💗", completed: false }
];

const pastelColors = ['#FFF3B0', '#FFC2D1', '#CDB4DB', '#BDE0FE'];
const rotations = ['-2deg', '1deg', '-1deg', '2deg', '-1.5deg', '1.5deg', '-2deg', '1deg', '-1deg'];

let plans = [];
let nextId = 9;

// Get elements
const stickyBoard = document.querySelector('.sticky-board');
const addPlanBtn = document.querySelector('.add-plan-btn');
const inputContainer = document.querySelector('.input-container');
const planInput = document.querySelector('.plan-input');
const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const backButton = document.querySelector('.back-button');

// Initialize plans from localStorage or use defaults
function initializePlans() {
    const savedPlans = localStorage.getItem('birthdayPlans');
    if (savedPlans) {
        plans = JSON.parse(savedPlans);
        nextId = Math.max(...plans.map(p => p.id)) + 1;
    } else {
        plans = [...defaultPlans];
        savePlans();
    }
    renderPlans();
}

// Save plans to localStorage
function savePlans() {
    localStorage.setItem('birthdayPlans', JSON.stringify(plans));
}

// Render all plans
function renderPlans() {
    stickyBoard.innerHTML = '';
    
    plans.forEach((plan, index) => {
        const stickyNote = createStickyNote(plan, index);
        stickyBoard.appendChild(stickyNote);
    });
    
    addEventListeners();
}

// Create a sticky note element
function createStickyNote(plan, index) {
    const note = document.createElement('div');
    note.className = `sticky-note ${plan.completed ? 'completed' : ''}`;
    note.dataset.id = plan.id;
    
    // Use predefined rotation for first 9 notes, random for new ones
    const rotation = index < rotations.length ? rotations[index] : getRandomRotation();
    const bgColor = index < pastelColors.length ? pastelColors[index % pastelColors.length] : getRandomColor();
    
    note.style.setProperty('--rotation', rotation);
    if (!plan.completed) {
        note.style.setProperty('--bg-color', bgColor);
    }
    
    note.innerHTML = `
        <div class="checkbox ${plan.completed ? 'checked' : ''}">
            ${plan.completed ? '✓' : '☐'}
        </div>
        <p>${plan.text}</p>
    `;
    
    return note;
}

// Get random rotation for new notes
function getRandomRotation() {
    const rotationValue = (Math.random() - 0.5) * 4; // -2 to 2 degrees
    return `${rotationValue}deg`;
}

// Get random pastel color for new notes
function getRandomColor() {
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

// Add event listeners to checkboxes and notes
function addEventListeners() {
    const checkboxes = document.querySelectorAll('.checkbox');
    const stickyNotes = document.querySelectorAll('.sticky-note');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlan(checkbox);
        });
    });
    
    stickyNotes.forEach(note => {
        note.addEventListener('click', function(e) {
            if (!e.target.classList.contains('checkbox')) {
                // Bounce animation
                this.style.transform = `rotate(0deg) scale(0.95)`;
                setTimeout(() => {
                    this.style.transform = `rotate(var(--rotation, 0deg)) scale(1)`;
                }, 150);
            }
        });
    });
}

// Toggle plan completion
function togglePlan(checkbox) {
    const noteElement = checkbox.closest('.sticky-note');
    const planId = parseInt(noteElement.dataset.id);
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
        plan.completed = !plan.completed;
        
        // Update UI
        if (plan.completed) {
            checkbox.textContent = '✓';
            checkbox.classList.add('checked');
            noteElement.classList.add('completed');
            noteElement.style.setProperty('--bg-color', '#E6FFE6');
        } else {
            checkbox.textContent = '☐';
            checkbox.classList.remove('checked');
            noteElement.classList.remove('completed');
            // Restore original color
            const index = plans.findIndex(p => p.id === planId);
            const bgColor = index < pastelColors.length ? pastelColors[index % pastelColors.length] : getRandomColor();
            noteElement.style.setProperty('--bg-color', bgColor);
        }
        
        savePlans();
    }
}

// Add new plan functionality
addPlanBtn.addEventListener('click', () => {
    inputContainer.classList.remove('hidden');
    planInput.focus();
});

cancelBtn.addEventListener('click', () => {
    inputContainer.classList.add('hidden');
    planInput.value = '';
});

addBtn.addEventListener('click', () => {
    const text = planInput.value.trim();
    if (text) {
        const newPlan = {
            id: nextId++,
            text: text,
            completed: false
        };
        
        plans.push(newPlan);
        savePlans();
        renderPlans();
        
        inputContainer.classList.add('hidden');
        planInput.value = '';
        
        // Animate the new note
        setTimeout(() => {
            const newNote = document.querySelector(`[data-id="${newPlan.id}"]`);
            if (newNote) {
                newNote.style.animation = 'popIn 0.6s ease-out';
            }
        }, 100);
    }
});

planInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
    if (e.key === 'Escape') {
        cancelBtn.click();
    }
});

// Back button functionality
backButton.addEventListener('click', () => {
    window.location.href = 'surprise.html';
});

// Initialize the page
initializePlans();

// Add gentle shake animation to random notes
setInterval(() => {
    const stickyNotes = document.querySelectorAll('.sticky-note');
    if (stickyNotes.length > 0) {
        const randomNote = stickyNotes[Math.floor(Math.random() * stickyNotes.length)];
        randomNote.style.animation = 'none';
        
        setTimeout(() => {
            randomNote.style.animation = 'gentleShake 0.5s ease-in-out';
        }, 10);
    }
}, 8000);

// Add gentle shake keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes gentleShake {
        0%, 100% { transform: rotate(var(--rotation, 0deg)) scale(1); }
        25% { transform: rotate(calc(var(--rotation, 0deg) + 1deg)) scale(1.02); }
        75% { transform: rotate(calc(var(--rotation, 0deg) - 1deg)) scale(1.02); }
    }
`;
document.head.appendChild(style);