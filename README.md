# Beatmaker
Welcome to Beatmaker, an interactive web application for creating beats and rhythms. Beatmaker allows you to play with different instrument sounds, create custom sequences, and control the tempo to produce your own beats. This project utilizes HTML, CSS, and JavaScript, as well as the Web Audio API, to provide a seamless and engaging music-making experience.

## Demo
Open in new tab or window: https://marcus-rk.github.io/beatmaker/

## Features
* **Instrument Sounds:** Beatmaker offers three different instrument sounds: Kick, Snare, and High-hat. Each sound has its own unique character.
* **Sequencer:** Create your own beat sequences by toggling buttons for each instrument in the grid. Experiment with different patterns and rhythms.
* **BPM Control:** Adjust the beats per minute (BPM) to set the tempo of your sequence. You can enter the desired BPM or use the slider for precise control.
* **Play/Pause:** Start and stop the sequencer with the Play button or by pressing the spacebar. This allows you to control when your beat starts and stops.
* **Reset:** Clear all active buttons and start fresh with a clean slate by clicking the Reset button.
* **Responsive Design:** The application is responsive and adapts to both desktop and mobile screens, making it easy to create beats on various devices.

## How It Works
Beatmaker is powered by the **Web Audio API** and is structured as follows:

* **HTML:** Defines the user interface, including the grid for sequencing, BPM control, and explanation pop-ups.
* **CSS:** Enhances the visual design and responsiveness of the application, creating an engaging user experience with color palettes and animations.
* **JavaScript:** Implements the core functionality of the sequencer. It initializes audio contexts, handles button clicks, manages the playback loop, and handles BPM control.
* **Audio Files:** The audio samples (Kick, Snare, High-hat) are fetched and decoded using the Web Audio API. These samples are then triggered when the corresponding buttons are active.

## JavaScript Overview
The JavaScript code in this project is responsible for orchestrating the beat-making process and providing an interactive user experience. Here's a brief overview of the key functions and their roles:

* **initializeSequencer():** Initializes the sequencer by creating row objects, loading audio samples, and creating button objects.
* **createRowObject(rowElement):** Creates a row object with information about the row, including name, audio type, audio buffer, and color palette.
* **createButtonObject(buttonElement, colorPalette):** Creates a button object with information about the button element, active state, and color palette.
* **togglePlay():** Toggles the playing state of the sequencer, starting or stopping the playback loop.
* **playLoop():** Controls the main playback loop, triggering instrument sounds for active buttons and managing UI for the playing buttons.
* **reset():** Resets the state of all buttons in the sequencer to their default (inactive) state.
* **fetchAudioFile(url):** Fetches an audio file from a given URL, decodes it into an AudioBuffer, and returns it.
* **playSample(audioBuffer):** Plays an audio sample using the Web Audio API.
* **handleBPMChange():** Handles changes to the BPM input field, ensuring the new BPM value is within a valid range.

Enjoy making beats with Beatmaker! 🎶
