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
        audioName: '',
        colorPalette: '',
    };

    // get audio type from row span name etc. kick, snare etc.
    switch (rowObject.name) {
        case 'Kick':
            rowObject.audioName = 'kick/kick_1.aac';
            rowObject.colorPalette = 'kick';
            break;
        case 'Snare':
            rowObject.audioName = 'snare/snare_1.aac';
            rowObject.colorPalette = 'snare';
            break;
        case 'High-hat':
            rowObject.audioName = 'high-hat/high-hat_1.aac';
            rowObject.colorPalette = 'high-hat';
            break;
    }

    spanElement.classList.add(rowObject.colorPalette);

    const buttonElements = rowElement.querySelectorAll('button');

    buttonElements.forEach(buttonElement => {
        // preload audio for better performance on mobile or slower pc's
        const audio = new Audio(`https://raw.githubusercontent.com/marcus-rk/beatmaker/main/audio/${rowObject.audioName}`);
        audio.preload = 'auto';
        audio.load();

        const buttonObject = {
            buttonElement: buttonElement,
            isActive: false,
            audio: audio,
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
            const buttonObject = currentRow.buttons[beatIndex];
            const buttonElement = buttonObject.buttonElement;

            buttonElement.classList.add('playing');

            if (buttonObject.isActive) {
                buttonObject.audio.play();
                buttonElement.click();
                setTimeout(() => {
                    buttonElement.click();
                }, 150);
            }

            setTimeout(() => {
                buttonElement.classList.remove('playing');
            }, 150);

        }

        beatIndex = (beatIndex + 1) % beatsPerRow;

        setTimeout(playLoop, (30000 / BPM)); // Adjust the timing as needed
    }
}