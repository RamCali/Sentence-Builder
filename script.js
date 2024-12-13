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