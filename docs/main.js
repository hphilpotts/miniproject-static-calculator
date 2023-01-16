// -- Let's set some variables:   

let display = ''; // shows on the screen
let buttonPress = null; // last button to be pressed
let lastOperator = null;
let currentInput = 0; // input being added
let previousInput = 0; // previously added input
    // ? would this be any different from display?

const logGlobals = () => {
    console.log('display: ' + display);
    console.log('buttonPress: ' + buttonPress);
    console.log('lastOperator: ' + lastOperator);
    console.log('currentInput: ' + currentInput);
    console.log('previousInput ' + previousInput);
    console.log('--');
}

const resetInputs = () => {
    buttonPress = null;
    lastOperator = null;
    currentInput = 0;
    previousInput = 0;
}


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
const numerics = new RegExp("[0-9]");

const processButtonPress = input => {
    switch (true) {
        case (numerics.test(input)):
            numberPress(input);
            break;
        case (unaryOperators.includes(input)):
            unaryOperatorPress(input);
            break;
        case (binaryOperators.includes(input)):
            binaryOperatorPress(input);
            break;
        case (input === '='):
            equalsPress();
            break;
        case (input === 'C'):
            cancel();
            break;
        default:
            console.log(`I'm not sure how we got here...`);
    }
};

const numberPress = input => {
    display += input;
    currentInput += input;
    setDisplay(display);
    logGlobals();
};

const unaryOperatorPress = input =>  {
    console.log('unary operator pressed!', input);

}

const binaryOperatorPress = input => {
    lastOperator = input; // set operator based upon button pressed

    // move current input to previous input then reset to zero:
    previousInput = currentInput;
    currentInput = 0;
    display = '';
    clearDisplay();
    logGlobals();
}

const equalsPress = () => {
    logGlobals();
    evaluateInputs(previousInput, currentInput); // here's where the mathgic happens
    resetInputs();
    console.log('New values:')
    logGlobals();
}

const cancel = () => {
    currentInput = 0;
    previousInput = 0;
    buttonPress = null;
    lastOperator = null;
    display = ''
    clearDisplay();
}


// -- Update display:
const displayTarget = document.getElementById('screen-display');
const setDisplay = value => displayTarget.innerText = value;
const clearDisplay = () => displayTarget.innerText = '';

// -- Math time:

const evaluateInputs = (previous, current) => {
    let output = null;
    const previousN = parseInt(previous);
    const currentN = parseInt(current); 
    switch (lastOperator) {
        case '/':
            output = previousN / currentN; break;
        case 'x':
            output = previousN * currentN; break;
        case '-':
            output = previousN - currentN; break;
        case '+':
            output = previousN + currentN; break;
        case '.':
            output = 'hmmm'
        default:
            console.log('Error in evaluateInputs'); 
    }
    console.log('maths coming out = ', output)
    setDisplay(output.toString());
    display = '';
}

// Testing, testing:
// lastOperator = '+';
// evaluateInputs