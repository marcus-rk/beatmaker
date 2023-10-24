// makj0005

let isPlaying = false; // default false
let beatIndex = 0; // default 0
let BPM = 120; // default 120
let isMobile = window.innerWidth <= 768; // same as in CSS

const bpmInputElement = document.getElementById('bpm');

bpmInputElement.addEventListener('change', () => {
    let newBPM = bpmInputElement.value;

    // Ensure the newBPM value is within the valid range
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

const sequencerElement = document.querySelector('.sequencer');
const rowElements = sequencerElement.querySelectorAll('.row')

const sequencer = [];
rowElements.forEach(rowElement => {
    const spanElement = rowElement.querySelector('span');
    const rowObject = {
        name: spanElement.innerText,
        buttons: [],
        audioType: '',
        colorPalette: '',
    };

    // get audio type from row span name etc. kick, snare etc.
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

    const buttonElements = rowElement.querySelectorAll('button')

    buttonElements.forEach(buttonElement => {
        const buttonObject = {
            id: buttonElement.id, // TODO: is this needed?
            isActive: false,
            audio: new Audio(`/audio/${rowObject.audioType}`),
            colorPalette: rowObject.colorPalette,
        }

        // Change status of buttonObject and buttonElement
        buttonElement.addEventListener('click', () => {
            buttonObject.isActive = !buttonObject.isActive;

            buttonElement.classList.toggle('active' , buttonObject.isActive);
            buttonElement.classList.toggle(rowObject.colorPalette, buttonObject.isActive);
        });

        rowObject.buttons.push(buttonObject);
    });

    sequencer.push(rowObject);
});

const playButton = document.querySelector('header button');

playButton.addEventListener('click', togglePlay);
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        togglePlay();
        event.preventDefault(); // Prevent scrolling behavior in some browsers
    }
});


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
            const currentButton = currentRow.buttons[beatIndex];

            if (currentButton.isActive) {
                currentButton.audio.play();
            }
        }

        beatIndex = (beatIndex + 1) % beatsPerRow;

        setTimeout(playLoop, (30000 / BPM)); // Adjust the timing as needed
    }
}