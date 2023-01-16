// -- Let's set some variables:   

let display = ''; // shows on the screen
let buttonPress = null; // last button to be pressed
let currentInput = 0; // input being added
let previousInput = 0; // previously added input
    // ? would this be any different from display?


// -- Add event listeners w/click handler to all buttons:

const buttons = document.querySelectorAll(".button-inner");

// Get button's innerHTML and then process accordingly (see -- Processing Button Presses)
function handleClick(){
    buttonPress = this.innerHTML;
    processButtonPress(buttonPress);
};

buttons.forEach(button => button.addEventListener('click', handleClick));


// -- Processing button presses:

const processButtonPress = input => {
    if (input.match(/[0-9]/)) numberPress(input);
    if (input === '=') clearDisplay();
}

const numberPress = input => {
    display += input;
    setDisplay(display);
}


// -- Update display:
const displayTarget = document.getElementById('screen-display');
const setDisplay = value => displayTarget.innerText = value;
const clearDisplay = () => displayTarget.innerText = '';