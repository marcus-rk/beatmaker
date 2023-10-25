// Makj0005

// Create an AudioContext (works like an audio engine/factory)
// This solution uses the Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext);

// Creating a sequencer object to store sequencer-related data
const sequencer = {
    rows: [],
    isPlaying: false,
    beatIndex: 0,
    BPM: 120,
    isMobile: window.innerWidth <= 768,
};

// Select DOM elements
const bpmInputElement = document.getElementById('bpm');
const playButton = document.querySelector('header button');
const sequencerElement = document.querySelector('.sequencer');
const rowElements = sequencerElement.querySelectorAll('.row');

// Event listeners
bpmInputElement.addEventListener('change', handleBPMChange);
window.addEventListener('resize', handleResize);
document.addEventListener('keydown', handleSpacebar);
playButton.addEventListener('click', togglePlay);

// Start initialization of the sequencer
initializeSequencer();

/**
 * Initializes the sequencer by creating row objects: containing
 * loaded audio data, color palette, and button objects.
 */
function initializeSequencer() {
    // Iterate through each row element in the sequencer
    rowElements.forEach(rowElement => {
        const rowObject = createRowObject(rowElement);
        // Construct the URL for the audio file of this row. (This is a raw URL to the GitHub repo)
        const url = `https://raw.githubusercontent.com/marcus-rk/beatmaker/main/audio/${rowObject.audioType}`;

        // Fetch and decode the audio file into an audio buffer
        fetchAudioFile(url)
            .then(audioBuffer => {
                rowObject.audioBuffer = audioBuffer;

                const buttonElements = rowElement.querySelectorAll('button');

                buttonElements.forEach(buttonElement => {
                    const buttonObject = createButtonObject(buttonElement, rowObject.colorPalette);
                    rowObject.buttons.push(buttonObject);
                });
            });

        sequencer.rows.push(rowObject);
    });
}

/**
 * Creates a row object with information about the row, including name, audio type, audio buffer, and color palette.
 *
 * @param {HTMLElement} rowElement - The DOM element representing the row in the sequencer.
 * @returns {object} An object representing the row.
 */
function createRowObject(rowElement) {
    const spanElement = rowElement.querySelector('span');
    const name = spanElement.innerText;

    const rowObject = {
        name: name,
        buttons: [],
        audioBuffer: null,
        audioType: '',
        colorPalette: '',
    };

    // Determine the audio type and color palette based on the row name
    switch (name) {
        case 'Kick':
            rowObject.audioType = 'kick/kick_1.wav';
            rowObject.colorPalette = 'kick';
            break;
        case 'Snare':
            rowObject.audioType = 'snare/snare_1.wav';
            rowObject.colorPalette = 'snare';
            break;
        case 'High-hat':
            rowObject.audioType = 'high-hat/high-hat_1.wav';
            rowObject.colorPalette = 'high-hat';
            break;
    }

    // Add a CSS class to the row span element to change its color based on the color palette
    spanElement.classList.add(rowObject.colorPalette);

    return rowObject;
}

/**
 * Creates a button object with information about the button element, active state, and color palette.
 *
 * @param {HTMLElement} buttonElement - The DOM element representing the button.
 * @param {string} colorPalette - The color palette associated with the row.
 * @returns {object} Button object representing the button.
 */
function createButtonObject(buttonElement, colorPalette) {
    const buttonObject = {
        buttonElement: buttonElement,
        isActive: false,
        colorPalette: colorPalette,
    };

    // Add a click event listener to toggle the button's active state and update its appearance
    buttonElement.addEventListener('click', () => {
        buttonObject.isActive = !buttonObject.isActive;
        buttonElement.classList.toggle(buttonObject.colorPalette, buttonObject.isActive);
    });

    return buttonObject;
}

/**
 * Toggles the playing state of the sequencer, starting or stopping the playback loop.
 * This also updates the playButton element
 */
function togglePlay() {
    sequencer.isPlaying = !sequencer.isPlaying;

    if (sequencer.isPlaying) {
        playButton.innerText = 'Stop';
        playButton.classList.add('kick');
        playLoop();
    } else {
        playButton.innerText = 'Play';
        playButton.classList.remove('kick');
        sequencer.beatIndex = 0;
    }
}

/**
 * Controls the main playback loop by:
 * - Triggering instrument sounds for active buttons in each row.
 * - Managing UI for the playing buttons.
 * - Scheduling the next loop iteration based on the selected BPM (Beats Per Minute).
 */
function playLoop() {
    if (sequencer.isPlaying) {
        const numberOfRows = sequencer.rows.length;
        const beatsPerRow = sequencer.isMobile ? 4 : 8;
        const timeOutBuffer = 150;

        // Iterate through each row in the sequencer
        for (let i = 0; i < numberOfRows; i++) {
            const currentRow = sequencer.rows[i];
            const buttonObject = currentRow.buttons[sequencer.beatIndex];
            const buttonElement = buttonObject.buttonElement;
            let needClick = false;

            // Add 'playing' CSS to the button for visual feedback
            buttonElement.classList.add('playing');

            // If the button is active, play the audio sample and remove color palette by click
            if (buttonObject.isActive) {
                playSample(currentRow.audioBuffer);
                buttonElement.click();
                needClick = true;
            }

            // After a timeout, remove 'playing' CSS and add color palette by button click if needed
            setTimeout(() => {
                if (needClick) {
                    buttonElement.click();
                }
                buttonElement.classList.remove('playing');
            }, timeOutBuffer);
        }

        // Move to the next beat in the sequence
        sequencer.beatIndex = (sequencer.beatIndex + 1) % beatsPerRow;

        // Schedule the next loop iteration based on the selected BPM
        setTimeout(playLoop, (60000 / sequencer.BPM) - timeOutBuffer);
    }
}

/**
 * Fetches an audio file from the given URL,
 * Converts the response data to an array buffer.
 * Decodes the array buffer with the Audio Context and converts it into an AudioBuffer.
 *
 * @param {string} url - The URL of the audio file to fetch.
 * @returns {Promise<AudioBuffer>} A Promise that resolves to the decoded audio data as an AudioBuffer.
 */
function fetchAudioFile(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

/**
 * Play an audio sample using the Web Audio API.
 *
 * Create a BufferSource node with the audio context
 * Assign the audio buffer to the BufferSource node
 * Connect the BufferSource node to the audio destination (output device)
 * Start playing the audio
 *
 * @param {AudioBuffer} audioBuffer - The sound sample to be played.
 */
function playSample(audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination);
    sampleSource.start();
}

/**
 * Handles changes to the BPM input field, ensuring the new BPM value is within a valid range.
 * Range is: 40-240 BPM (this is also set in the HTML attributes)
 */
function handleBPMChange() {
    let newBPM = bpmInputElement.value;

    if (newBPM < 40) {
        newBPM = 40;
    } else if (newBPM > 240) {
        newBPM = 240;
    }

    bpmInputElement.value = newBPM;
    sequencer.BPM = bpmInputElement.value;
}

/**
 * Updates the isMobile boolean based on the current window size,
 * adapting for mobile or desktop view.
 */
function handleResize() {
    sequencer.isMobile = window.innerWidth <= 768;
}

/**
 * Listens for the spacebar key press and toggles play/pause when the spacebar is pressed.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleSpacebar(event) {
    if (event.key === ' ' || event.key === 'Spacebar') {
        togglePlay();
        event.preventDefault(); // To prevent scroll-down on some browsers and devices
    }
}
