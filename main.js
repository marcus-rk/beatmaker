// Makj0005

// Create an AudioContext (works like an audio engine/factory)
// This solution uses the Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext);

// Define global constants and variables
const sequencer = [];
let isPlaying = false;
let beatIndex = 0;
let BPM = 120;
let isMobile = window.innerWidth <= 768;

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
 * loaded audio data, color palette and button objects.
 */
function initializeSequencer() {
    rowElements.forEach(rowElement => {
        const rowObject = createRowObject(rowElement);

        fetchAudioFile(`https://raw.githubusercontent.com/marcus-rk/beatmaker/main/audio/${rowObject.audioType}`)
            .then(audioBuffer => {
                rowObject.audioBuffer = audioBuffer;

                const buttonElements = rowElement.querySelectorAll('button');
                buttonElements.forEach(buttonElement => {
                    const buttonObject = createButtonObject(buttonElement, rowObject.colorPalette);
                    rowObject.buttons.push(buttonObject);
                });
            });

        sequencer.push(rowObject);
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
        name,
        buttons: [],
        audioBuffer: null,
        audioType: '',
        colorPalette: '',
    };

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

    spanElement.classList.add(rowObject.colorPalette);
    return rowObject;
}

/**
 * Creates a button object with information about the button element, active state and color palette.
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

    buttonElement.addEventListener('click', () => {
        buttonObject.isActive = !buttonObject.isActive;
        buttonElement.classList.toggle('active', buttonObject.isActive);
        buttonElement.classList.toggle(colorPalette, buttonObject.isActive);
    });

    return buttonObject;
}

/**
 * Toggles the playing state of the sequencer, starting or stopping the playback loop.
 * This also updates the playButton element
 */
function togglePlay() {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playButton.innerText = 'Stop';
        playButton.classList.add('kick');
        playLoop();
    } else {
        playButton.innerText = 'Play';
        playButton.classList.remove('kick');
        beatIndex = 0;
    }
}

/**
 * Controls the main playback loop by:
 * - Triggering instrument sounds for active buttons in each row.
 * - Managing UI for the playing buttons.
 * - Scheduling the next loop iteration based on the selected BPM (Beats Per Minute).
 */
function playLoop() {
    if (isPlaying) {
        const numberOfRows = sequencer.length;
        const beatsPerRow = isMobile ? 4 : 8;
        const timeOutBuffer = 150;

        for (let i = 0; i < numberOfRows; i++) {
            const currentRow = sequencer[i];
            const buttonObject = currentRow.buttons[beatIndex];
            const buttonElement = buttonObject.buttonElement;
            let needClick = false;

            buttonElement.classList.add('playing');

            if (buttonObject.isActive) {
                playSample(currentRow.audioBuffer);
                buttonElement.click();
                needClick = true;
            }

            setTimeout(() => {
                if (needClick) {
                    buttonElement.click();
                }
                buttonElement.classList.remove('playing');
            }, timeOutBuffer);
        }

        beatIndex = (beatIndex + 1) % beatsPerRow;

        setTimeout(playLoop, (60000 / BPM) - timeOutBuffer);
    }
}

/**
 * Fetches an audio file from the given URL,
 * Convert the response data to an array buffer.
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
 * range is: 40-240 BPM (this is also set in the HTML attributes)
 */
function handleBPMChange() {
    let newBPM = bpmInputElement.value;

    if (newBPM < 40) {
        newBPM = 40;
    } else if (newBPM > 240) {
        newBPM = 240;
    }

    bpmInputElement.value = newBPM;
    BPM = bpmInputElement.value;
}

/**
 * Updates the isMobile boolean based on the current window size,
 * adapting for mobile or desktop view.
 */
function handleResize() {
    isMobile = window.innerWidth <= 768;
}

/**
 * Listens for the spacebar key press and toggles play/pause when spacebar is pressed.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 */
function handleSpacebar(event) {
    if (event.key === ' ' || event.key === 'Spacebar') {
        togglePlay();
        event.preventDefault(); // to prevent scroll-down on some browsers and devices
    }
}