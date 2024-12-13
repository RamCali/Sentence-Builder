async function loadGame() {
    const response = await fetch('data.json');
    const data = await response.json();

    // Load the first activity
    loadActivity(data[0]);
}

function loadActivity(activity) {
    // Set the image
    const imageElement = document.querySelector('.image img');
    imageElement.src = activity.image;

    // Create the sentence with placeholders
    const sentenceContainer = document.querySelector('.sentence');
    sentenceContainer.innerHTML = ''; // Clear existing content

    activity.sentence.forEach((word, index) => {
        if (activity.placeholders.includes(index)) {
            const placeholder = document.createElement('span');
            placeholder.classList.add('placeholder');
            placeholder.dataset.word = word;
            sentenceContainer.appendChild(placeholder);
        } else {
            const text = document.createElement('span');
            text.textContent = word + ' ';
            sentenceContainer.appendChild(text);
        }
    });

    // Create the draggable words
    const wordsContainer = document.querySelector('.words');
    wordsContainer.innerHTML = ''; // Clear existing content

    activity.words.forEach(word => {
        const wordElement = document.createElement('span');
        wordElement.classList.add('word');
        wordElement.textContent = word;
        wordElement.setAttribute('draggable', 'true');
        wordElement.dataset.word = word;
        wordsContainer.appendChild(wordElement);
    });

    addDragAndDropListeners();
}

function addDragAndDropListeners() {
    const words = document.querySelectorAll('.word');
    const placeholders = document.querySelectorAll('.placeholder');
    const message = document.getElementById('message');

    words.forEach(word => {
        word.addEventListener('dragstart', () => {
            word.classList.add('dragging');
        });

        word.addEventListener('dragend', () => {
            word.classList.remove('dragging');
        });
    });

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('dragover', e => {
            e.preventDefault();
        });

        placeholder.addEventListener('drop', e => {
            e.preventDefault();
            const draggingWord = document.querySelector('.dragging');
            if (draggingWord && draggingWord.dataset.word === placeholder.dataset.word) {
                placeholder.textContent = draggingWord.textContent;
                draggingWord.remove();

                checkCompletion();
            }
        });
    });
}

function checkCompletion() {
    const placeholders = document.querySelectorAll('.placeholder');
    const completed = Array.from(placeholders).every(placeholder => placeholder.textContent.trim() !== '');
    const message = document.getElementById('message');
    if (completed) {
        message.textContent = 'Great job! You completed the sentence!';
    }
}

// Load the game
loadGame();

// Start of confetti logic
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiColors = ['#4caf50', '#ffeb3b', '#2196f3', '#f44336'];
    const particles = [];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            radius: Math.random() * 6 + 2,
            velocityX: Math.random() * 2 - 1,
            velocityY: Math.random() * 3 + 1,
        });
    }

    function render() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            if (particle.y > canvas.height) {
                particles.splice(index, 1);
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            context.fillStyle = particle.color;
            context.fill();
        });

        if (particles.length > 0) {
            requestAnimationFrame(render);
        } else {
            canvas.style.display = 'none';
        }
    }

    canvas.style.display = 'block';
    render();
}

// Trigger the custom confetti in `checkCompletion`
function checkCompletion() {
    const placeholders = document.querySelectorAll('.placeholder');
    const completed = Array.from(placeholders).every(placeholder => placeholder.textContent.trim() !== '');
    const message = document.getElementById('message');

    if (completed) {
        message.textContent = 'Great job! You completed the sentence!';
        showConfetti();
    }
    function showConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const context = canvas.getContext('2d');
    
        // Resize the canvas to fit the screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        const confettiColors = ['#4caf50', '#ffeb3b', '#2196f3', '#f44336'];
        const particles = [];
    
        // Create 100 particles
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                radius: Math.random() * 6 + 2,
                velocityX: Math.random() * 2 - 1,
                velocityY: Math.random() * 3 + 1,
            });
        }
    
        function render() {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            particles.forEach((particle, index) => {
                // Update particle position
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
    
                // Remove particle if it goes out of bounds
                if (particle.y > canvas.height) {
                    particles.splice(index, 1);
                }
    
                // Draw the particle
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
                context.fillStyle = particle.color;
                context.fill();
            });
    
            // Continue rendering while particles exist
            if (particles.length > 0) {
                requestAnimationFrame(render);
            } else {
                canvas.style.display = 'none'; // Hide canvas when done
            }
        }
    
        canvas.style.display = 'block'; // Ensure canvas is visible
        render();
    }
}

//End of confetti logic