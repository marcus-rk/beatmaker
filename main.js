// makj0005


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