// MAIN SCRIPT 2.0: CALULATOR FUNCTIONALITY, MODE FUNCTIONALITY

// * * CALCULATOR FUNCTIONALITY

    // Perform calculator operations and update display accordingly.
    // see sections for:
        // - Global variables
        // - Event listeners and handle button click
        // - Processing button presses
        // - Update display


// * -- Global variables:
type GlobalVariable = string | null;
let leftNum: GlobalVariable = null; // the number (as string) on the left hand side of the sum - will also be used to store the number most recently evaluated
let currentRightNum: GlobalVariable = null; // the number (as string) on the right hand side of a sum, currently being input by used
let prevRightNum: GlobalVariable = null; // the previously input currentRightNum (storing this allows repeated press of `=` to repeat previous operation)
let currentOperator: GlobalVariable = null; // the most recently pressed operator, held ready for eval in the event of `=` or binary operator press
let prevOperator: GlobalVariable = null; // the previously used binary operator, allows for repeated press of `=` 

const resetAll = ():void => { // Full reset of all Global variables to null
    leftNum = null; currentRightNum = null; prevRightNum = null; currentOperator = null; prevOperator = null;
};


// * -- Event listeners and handle button click:

const buttons = document.querySelectorAll(".button-inner");

const click = <HTMLAudioElement> document.getElementById('click'); // ! currently seeing issue with deployed version via mobile browsers 
click.preload = "auto";
click.volume = 0.3; // setting in JS as no volume attribute supported by browsers

// Get button innerHTML string, pass this as input to processButtonPress:
function handleClick():void {
    click.play();
    let buttonPress: string = this.innerHTML;
    processButtonPress(buttonPress); // see section immediately below:
};

buttons.forEach(button => button.addEventListener('click', handleClick));


// * -- Processing button presses:

// input is the innerHTML from the button being pressed, passed from handleClick() above:
const processButtonPress = (input: string): void => {

    // button innerHTML strings grouped by type (with respective functions to run for each type)
    const unaryOperators: string[] = ['+/-', '%', '√'];
    const binaryOperators: string[] = ['/', 'x', '-', '+'];
    const numbers: RegExp = new RegExp("[0-9]") // regex previously included '.' as well, however this caused every other `numbers.test(input)` to fail
    switch (true) {
        case (numbers.test(input) || input === '.'): // decimal can be mostly handled the same way as a number (press): i.e. as string
            numberPress(input); break
        case (unaryOperators.includes(input)):
            unaryOperatorPress(input); break
        case (binaryOperators.includes(input)):
            binaryOperatorPress(input); break
        case (input === '='):
            equalsPress(); break // ? can equalsPress be integrated into binaryOperatorPress?
        case (input === 'C'):
            cancel(); break
        default:
            console.log(`Error - button pressed not caught, input was`, input); // default case to catch bad input
    }
};

// when number button is pressed, take the number pressed (as string), join on to to currentRightNum string and set display accordingly: 
const numberPress = (numberPressed: string): void => {
    if (numberPressed === '.') { // decimals need to be handled a little differently
        if (!currentRightNum) currentRightNum = leftNum; // allows for most recent result to be updated with decimal point
        if (currentRightNum.includes('.')) numberPressed = ''; // prevents more than one decimal point being added
    } 
    // 'if truthy' expression ensures null does not remain as part of the number being displayed (i.e. "null801.22")
    (currentRightNum === null) ? currentRightNum = numberPressed : currentRightNum += numberPressed;
    setDisplay(currentRightNum); // see Update Display section below
};

// when a unary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
const unaryOperatorPress = (unaryPressed: string): void =>  {
    if (unaryPressed === '+/-') { // despite also being a unary operator, it turns out '+/-' needs to be handled differently
        switch (true) {
            case (currentRightNum != null): // if there is currentRightNum then operate on this
                currentRightNum = (-currentRightNum).toString();
                setDisplay(currentRightNum); break
            case (currentOperator != null): // otherwise, if currentOperator, user will be modifying new currentRightNum yet to be added
                currentRightNum = '-';
                setDisplay(currentRightNum); break
            case (leftNum != null): // if neither of the above, user is trying to modify result saved as LH num and showing in display
                leftNum = (-leftNum).toString();
                setDisplay(leftNum); break
            default: // default case means no other relevant inputs stored: operator is first button pressed following clear / load
                currentRightNum = '-';
                setDisplay(currentRightNum);
        }
    } else { // other unary operators are handled simply:
        let operand: number | null = null;
        (!currentRightNum) ? operand = +leftNum : operand = +currentRightNum;
        switch (unaryPressed) {
            case '%': operand = operand / 100; break
            case  '√': operand = Math.sqrt(operand); break
            default: console.log('Error - unary input not found, it was', unaryPressed);
        }
        currentRightNum = operand.toString();
        setDisplay(currentRightNum);
    }
};

// when a binary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
const binaryOperatorPress = (binaryPressed: string): void => {
    let operand1: number = +leftNum, operand2: number = +currentRightNum;
    if (leftNum && currentOperator && currentRightNum) { // if sum already present in saved vars, evaluate and save binaryPressed as new currentOperator
        leftNum = performBinaryOperation(operand1, binaryPressed, operand2); // see function below equalsPress()
        currentOperator = binaryPressed;  
        prevRightNum = currentRightNum;
        currentRightNum = null;
        setDisplay(leftNum);
    } else if (currentRightNum) { // if there is a currentRight num
        leftNum = currentRightNum;
        currentOperator = binaryPressed;
        currentRightNum = null;
    } else if (leftNum) {
        currentOperator = binaryPressed;
    }
}

// TODO - either incorporate into binaryOperatorPress or break down into functions accessible to both equalsPress and binaryOperatorPress
const equalsPress = (): void => {
    let operand1: number = +leftNum, operand2: number = null;
    if (leftNum && currentOperator && currentRightNum) {
        // * in this section and similar section above in binaryOperatorPress, the multiple assignment statements represent the passing of values from one global variable to another as calculations are completed. It seems a bit unwieldy but I feel it is the clearest way of showing what is happening
        operand2 = +currentRightNum;
        leftNum = performBinaryOperation(operand1, currentOperator, operand2);
        prevOperator =  currentOperator;
        currentOperator = null;
        prevRightNum = currentRightNum;
        currentRightNum = null;
    } else if (leftNum && currentOperator && prevRightNum) {
        operand2 = +prevRightNum;
        leftNum = performBinaryOperation(operand1, currentOperator, operand2);
    } else if (leftNum && prevOperator && prevRightNum) {
        operand2 = +prevRightNum;
        leftNum = performBinaryOperation(operand1, prevOperator, operand2);
    }
    setDisplay(leftNum);
}

// Used in both binaryOperatorPress and equalsPress:
const performBinaryOperation = (val1: number, operator: string, val2: number): string => {
    let output: number | null = null;
    switch (operator) {
        case ('+'): output = val1 + val2; break
        case ('-'): output = val1 - val2; break
        case ('x'): output = val1 * val2; break
        case ('/'): output = val1 / val2; break
        default: console.log('Error - binary input not found, input was', operator);
    }
    return (output*1).toString(); // the *1 eliminates any unneccessary trailing 0s
};

const cancel = (): void => {
    resetAll();
    clearDisplay();
};


// * -- Update Display:

const display: HTMLElement = document.getElementById('screen-display');

// takes in a string (representing a number) and renders this in the calculator's display
const setDisplay = (numberAsString: string): void => {
    let displayValue: string = numberAsString
    // handle floats in order to fit number displayed to screen, if very large float (>99999999) display error, else trim down
    if (numberAsString.includes('.')) (numberAsString.indexOf('.') > 9) ? displayValue ="err" : displayValue = numberAsString.slice(0, 8);
    // handle large ints / very small floats
    if (displayValue.length > 8 || numberAsString.includes('e')) displayValue = "err"; // stops value being displayed from overlapping the screen
    // then set display:
    display.innerText = displayValue;
}

const clearDisplay = ():string => display.innerText = '';


// * * MODE FUNCTIONALITY:

    // Allow changes between different modes: light mode, dark mode, 'daft' mode. Light mode and dark mode being self-explanatory, daft mode changes calculator into a 'Daft Punk' soundboard. (n.b. - currently seeing issues with sound playback when deployed version accessed on mobile.)
    // 'daft' mode sections:
        // - setDaftMode
        // - startDaftMode
            // click event listener & handle click function
            // processDaftClick
            // handleSound
            // playAllSound


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

