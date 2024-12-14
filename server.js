const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Load existing activities
function loadActivity(index) {
    const activity = activities[index];

    // Set the image
    const imageElement = document.querySelector('.image img');
    imageElement.src = activity.image;

    // Create the sentence with random placeholders
    const sentenceContainer = document.querySelector('.sentence');
    sentenceContainer.innerHTML = ''; // Clear existing content

    const sentence = activity.sentence;
    const numPlaceholders = Math.min(activity.words.length, sentence.length); // Number of placeholders

    // Randomly pick unique indices for placeholders
    const placeholderIndices = [];
    while (placeholderIndices.length < numPlaceholders) {
        const randomIndex = Math.floor(Math.random() * sentence.length);
        if (!placeholderIndices.includes(randomIndex)) {
            placeholderIndices.push(randomIndex);
        }
    }

    sentence.forEach((word, idx) => {
        if (placeholderIndices.includes(idx)) {
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

    // Hide the "Next" button until the activity is completed
    document.getElementById('next-button').style.display = 'none';

    addDragAndDropListeners();
}

// API to handle activity submission
app.post('/add-activity', upload.single('image'), (req, res) => {
    try {
        const { sentence, placeholders, words } = req.body;

        // Parse placeholders and words
        const placeholdersArray = placeholders.split(',').map(Number);
        const wordsArray = words.split(',');

        // Create new activity
        const newActivity = {
            image: `uploads/${req.file.filename}`,
            sentence: sentence.split(' '),
            placeholders: placeholdersArray,
            words: wordsArray
        };

        // Append new activity to data.json
        const activities = loadActivities();
        activities.push(newActivity);
        fs.writeFileSync(dataPath, JSON.stringify(activities, null, 2));

        res.json({ message: 'Activity added successfully!', newActivity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding activity' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});