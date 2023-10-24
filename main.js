// Makj0005

// Create an AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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

bpmInputElement.addEventListener('change', () => {
    let newBPM = bpmInputElement.value;

    if (newBPM < 40) {
        newBPM = 40;
    } else if (newBPM > 240) {
        newBPM = 240;
    }

    bpmInputElement.value = newBPM;
    BPM = bpmInputElement.value;
});

window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
});

rowElements.forEach(rowElement => {
    const spanElement = rowElement.querySelector('span');
    const rowObject = {
        name: spanElement.innerText,
        buttons: [],
        audioBuffer: null,
        colorPalette: '',
    };

    switch (rowObject.name) {
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

    fetchAudioFile(`https://raw.githubusercontent.com/marcus-rk/beatmaker/main/audio/${rowObject.audioType}`)
        .then(audioBuffer => {
            rowObject.audioBuffer = audioBuffer;

            const buttonElements = rowElement.querySelectorAll('button');
            buttonElements.forEach(buttonElement => {
                const buttonObject = {
                    buttonElement: buttonElement,
                    isActive: false,
                    colorPalette: rowObject.colorPalette,
                };

                buttonElement.addEventListener('click', () => {
                    buttonObject.isActive = !buttonObject.isActive;
                    buttonElement.classList.toggle('active', buttonObject.isActive);
                    buttonElement.classList.toggle(rowObject.colorPalette, buttonObject.isActive);
                });

                rowObject.buttons.push(buttonObject);
            });
        });

    sequencer.push(rowObject);
});

playButton.addEventListener('click', togglePlay);
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        togglePlay();
        event.preventDefault();
    }
});

function fetchAudioFile(url) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data));
}

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

function playLoop() {
    if (isPlaying) {
        const numberOfRows = sequencer.length;
        const beatsPerRow = isMobile ? 4 : 8;

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
            }, 150);
        }

        beatIndex = (beatIndex + 1) % beatsPerRow;

        setTimeout(playLoop, (60000 / BPM) - 150);
    }
}

function playSample(audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.connect(audioContext.destination);
    sampleSource.start();
}
