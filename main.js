// makj0005


const sequencerElement = document.querySelector('.sequencer');
const rowElements = sequencerElement.querySelectorAll('.row')

const sequencer = [];
rowElements.forEach(rowElement => {
    const row = {
        name: rowElement.querySelector('span').innerText,
        buttons: []
    };

    const buttonElements = rowElement.querySelectorAll('button')

    buttonElements.forEach(buttonElement => {
        const button = {
            id : buttonElement.id,
            isActive : false,
            audio : new Audio();
        }

        buttonElement.addEventListener('click', () => {
            // Toggle the isActive property when the button is clicked
            button.isActive = !button.isActive;
            // You can add further logic here to visually update the button's appearance
        });

        row.buttons.push(button);
    });

    sequencer.push(row);
});

console.log(sequencer);