// * -- Global variables and their uses:   

let display = ''; // this is what shows on the screen
let buttonPress = null; // last button to be pressed, get from element's inner html thru event listener, passed to handleButtonPress
let lastOperator = null; // remember last operator presseed, used in evaluateInputs
let currentInput = ''; // number currently being input into calculator (via multiple button presses)
let previousInput = 0; // previously added input - get from currentInput when operator pressed, used in evaluateInput
let lastResult = null; // saves the result from evaluateInput, used to allow immediate operator press after '='

const resetInputs = () => buttonPress = null; lastOperator = null; currentInput = null; previousInput = null; // Used upon press of `=` or `C`:


// * -- Add event listeners w/click handler to all buttons:

const buttons = document.querySelectorAll(".button-inner");

// Get button innerHTML and then process accordingly (see -- Processing Button Presses)
function handleClick(){
    buttonPress = this.innerHTML;
    processButtonPress(buttonPress);
};

buttons.forEach(button => button.addEventListener('click', handleClick));


// * -- Processing button presses:

const unaryOperators = ['+/-', '%', '√'];
const binaryOperators = ['/', 'x', '-', '+'];
const numerics = new RegExp("[0-9]");

const processButtonPress = input => {
    switch (true) {
        case (numerics.test(input) || input === '.'):
            numberPress(input); break // decimal press can be used in the same way as a numeric press!
        case (unaryOperators.includes(input)):
            unaryOperatorPress(input); break
        case (binaryOperators.includes(input)):
            binaryOperatorPress(input); break
        case (input === '='):
            equalsPress(); break
        case (input === 'C'):
            cancel(); break
        default:
            console.log(`Error - I'm not sure how we got here...`);
    }
};

const numberPress = input => {
    if (!currentInput) currentInput = 0; // occasionally null sneaks through... this is where TypeScript would be great
    display += input;
    currentInput += input;
    setDisplay(display);
};

const unaryOperatorPress = input =>  {
    if (!currentInput) currentInput = lastResult;
    switch (input) {
        case '+/-': currentInput -= (currentInput * 2); break
        case '%': currentInput = currentInput /100; break
        case  '√': currentInput = Math.sqrt(currentInput); break
    }
    currentInput = currentInput.toFixed(4);
    if (!currentInput) currentInput = 0;
    setDisplay(currentInput.toString());
    lastResult = currentInput;
}

const binaryOperatorPress = input => {
    lastOperator = input; // set operator based upon button pressed

    // allows for operation on previously saved result (if next key press after `=` is a binary operator)
    if (currentInput === null) currentInput = lastResult;
    
    // move current input to previous input then reset to zero:
    previousInput = currentInput;
    currentInput = 0;
    display = '';
    clearDisplay();
}

const equalsPress = () => {
    evaluateInputs(previousInput, currentInput); // here's where the mathgic happens
    resetInputs();
}

const cancel = () => {
    currentInput = 0; previousInput = 0;
    buttonPress = null; lastOperator = null;
    display = ''
    clearDisplay();
}


// * -- Update display:
const displayTarget = document.getElementById('screen-display');

const setDisplay = value => {
    // if statement stops large values from overlapping screen, instead showing silly face
    if (value.length > 8) value = "Q_Q";
    displayTarget.innerText = value;
}
const clearDisplay = () => displayTarget.innerText = '';

// * -- Math time:

const evaluateInputs = (previous, current) => {
    let output = null;

    // if there is no previous input, treat this as 0
    if (!previousInput) {
        previousInput = '0'
    }

    const previousN = parseFloat(previous);
    const currentN = parseFloat(current); 
    switch (lastOperator) {
        case '/':
            output = previousN / currentN; break;
        case 'x':
            output = previousN * currentN; break;
        case '-':
            output = previousN - currentN; break;
        case '+':
            output = previousN + currentN; break;
        default:
            output = currentN; // if no operator pressed, saves current input to output
    }

    if (!output) {
        if (!lastResult) lastResult = 0;
        output = lastResult;
    }

    lastResult = output;

    let stringyOutput = output.toString();

    // trim trailing zeros in string to be displayed:
    if (stringyOutput.includes('.')) {
        stringyOutput = stringyOutput.slice(0, 8);
        
        const trimDecimalZeros = (str) => {
            if (str.endsWith('0')) {
                str.slice(0, -1);
                trimDecimalZeros(str);
            }
        }

        trimDecimalZeros(stringyOutput);
    }

    setDisplay(stringyOutput);
    display = '';
}