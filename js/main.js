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

const unaryOperators = ['+/-', '%', '√'];
const binaryOperators = ['/', 'x', '-', '+', '.'];

const processButtonPress = input => {
    if (input.match(/[0-9]/)) numberPress(input); // numeric
    if (unaryOperators.includes(input)) unaryOperatorPress(input); // unary operators
    if (binaryOperators.includes(input)) binaryOperatorPress(input); // binary operators
    if (input === '=') { // equals
        clearDisplay();
        display = ''; 
    };
    if (input === 'C') cancel(); // C
}

const numberPress = input => {
    display += input;
    setDisplay(display);
};
const unaryOperatorPress = input =>  console.log('unary operator pressed!', input);
const binaryOperatorPress = input => console.log('binary operator pressed: ', input);
const cancel = () => {
    currentInput = 0;
    previousInput = 0;
    buttonPress = 0;
    display = ''
    clearDisplay();
}


// -- Update display:
const displayTarget = document.getElementById('screen-display');
const setDisplay = value => displayTarget.innerText = value;
const clearDisplay = () => displayTarget.innerText = '';