// * * MODE FUNCTIONALITY:

// Allow changes between different modes: light mode, dark mode, 'daft' mode. Light mode and dark mode being self-explanatory, daft mode changes calculator into a 'Daft Punk' soundboard. (n.b. - currently seeing issues with sound playback when deployed version accessed on mobile.)
// 'daft' mode sections:
    // - setDaftMode
    // - startDaftMode
        // click event listener & handle click function
        // processDaftClick
        // handleSound
        // playAllSound


import { clearDisplay, setDisplay, display, resetAll } from "./main.js";

const modeChangeButtons: HTMLCollection = document.getElementsByClassName('control-button');
const styleSheet: HTMLElement = document.getElementById('current-stylesheet');


// * -- light mode:

const setLightMode = (): void => { // sets display mode to 'light mode', retains inputs if changing from dark mode
    if (styleSheet.getAttribute('href') === 'css/daftmode.css') clearDisplay(); // clear display if daft mode previously selected
    styleSheet.setAttribute('href', 'css/lightmode.css');
}

modeChangeButtons[0].addEventListener('click', setLightMode);


// * -- dark mode:

const setDarkMode = (): void => { // sets to 'dark mode', retaining calculations from light mode
    if (styleSheet.getAttribute('href') === 'css/daftmode.css') clearDisplay();
    styleSheet.setAttribute('href', 'css/nightmode.css');
}

modeChangeButtons[1].addEventListener('click', setDarkMode);


// * -- daft mode:

// sets display to 'daft mode', css file hides calculator buttons div and displays soundboard div before running `startDaftMode` function below:
const setDaftMode = ():void => {
    styleSheet.setAttribute('href', 'css/daftmode.css');
    startDaftMode();
}
modeChangeButtons[2].addEventListener('click', setDaftMode);

// runs in `setDaftMode` above, runs additional script to allow soundboard buttons to function:
const startDaftMode = (): void => {

    // select and preload all daft audio sound elements when daft mode started:
        // * attempting to speed up audio load / play times on mobile...
    const daftAudio: HTMLCollectionOf<HTMLAudioElement> = document.getElementById('daft-audio').getElementsByTagName('audio');
    for (let i: number = 0; i < daftAudio.length; i++) { daftAudio[i].preload = "auto" };

    clearDisplay(); // remove any value displayed from when used as calculator
    resetAll(); // clear all global variables - preventing inputs from 'persisting' from one calculator session to another.

    // click event listener for soundboard buttons and handle click function, innerHTML passed to `processDaftClick` below:
    const daftButtons: NodeList = document.querySelectorAll(".daft-button-inner");
    function handleDaftClick(): void {
        let daftButtonPress: string = this.innerHTML; // get innerHTML to pass as string in function below:
        processDaftClick(daftButtonPress);  // see section below
    }
    daftButtons.forEach(button => button.addEventListener('click', handleDaftClick));

    // take innerHTML from button press and process accordingly:
    const processDaftClick = (input: string): void => {
        const specialDaftButtons: string[] = ['play', 'random', 'faster', 'stop']; // 'special buttons' from top row have specific functions
        if (specialDaftButtons.includes(input)) { // if a special button, select functionality to be used:
            switch (input) {
                case ('play'):
                    playAllSound(550); // see below - iterates over soundInputs (array mirroring all non-special button innerHTML values), in effect simulating user pressing all buttons in order. Param is the delay in ms between playing the next sound
                    break
                case ('random'): // play sound at random.
                    const randomSound: string = soundInputs[Math.floor(Math.random() * soundInputs.length)];
                    handleSound(randomSound); 
                    break
                case ('faster'):
                    playAllSound(390); // as play above, but with a shorter delay between sounds.
                    break
                default:
                    // stop pressed, no special functionality required unless playAllSounds running - see halt() within playAllSounds below
                    null;
            }
        } else { // non special buttons handled as per handleSound function below:
            handleSound(input);
        }
    }

    // handle a non-special button press / simulate a non-special button press when called in `playAllSound` below:
    const handleSound = (input: string): void => { // input is the innerHTML of the button pressed, or a string from soundInputs below
        const audioID: string = input.replace(' ', '_');
        const audioElement = <HTMLAudioElement> document.getElementById(audioID) // select correct element
        display.innerHTML = input; // set 'calculator' display screen to reflect button that has been pressed
        audioElement.play().catch(); 
            // empty catch prevents mutiple console errors triggered when audio play in progress is interrupted by another
    }

    // soundInputs used for playAllSound below - array mirrors the innerHTML values from all special buttons in L-R, T-B order.
    const soundInputs: string[] = ['work it', 'harder', 'make it', 'better', 'do it', 'faster', 'makes us', 'stronger', 'more than', 'ever', 'hour', 'after', 'our', 'work is', 'never', 'over'];

    // plays all sounds with a delay between each set using delayLength parameter in ms
    async function playAllSound(delayLength: number){ // async required in order to implement delay (else all sounds are played nearly instantly!)
        const delay = (ms: number): Promise<unknown> => new Promise ((res: never) => setTimeout(res, ms)); // delay implemented using Promise constructor, timeout set in ms
        let haltFunc: boolean = false; // unless true function will continue to run 
        function halt(): void { haltFunc = true }; // when haltFunc changed to true stop running (see returns below)
        document.getElementById('stop').addEventListener('click', halt);
        for await (const soundInput of soundInputs) {
            if (haltFunc) return; // return halts function (accessed when stop button pressed)
            await delay(delayLength);
            handleSound(soundInput);
            if (haltFunc) return; // as above, placed other side of delay to minimise gap between stop being pressed and function halting
        }
    }
}