// MAIN SCRIPT 2.0

// * -- Global variables:

let leftNum = null; // the number (as string) on the left hand side of the sum - will also be used to store the number most recently evaluated
let currentRightNum = null; // the number (as string) on the right hand side of a sum, currently being input by used
let prevRightNum = null; // the previously input currentRightNum (storing this allows repeated press of `=` to repeat previous operation)
let currentOperator = null; // the most recently pressed operator, held ready for eval in the event of `=` or binary operator press
let prevOperator = null; // the previously used binary operator, allows for repeated press of `=` 

const resetAll = () => { // Full reset of all Global variables to null
    leftNum = null; currentRightNum = null; prevRightNum = null; currentOperator = null; prevOperator = null;
};


// * -- Event listeners and handle button click:

const buttons = document.querySelectorAll(".button-inner");

// Get button innerHTML string, pass this as input to processButtonPress:
function handleClick(){
    buttonPress = this.innerHTML;
    processButtonPress(buttonPress); // see section immediately below:
};

buttons.forEach(button => button.addEventListener('click', handleClick));


// * -- Processing button presses:

// input is the innerHTML from the button being pressed, passed from handleClick() above:
const processButtonPress = input => {

    // button innerHTML strings grouped by type (with respective functions to run for each type)
    const unaryOperators = ['+/-', '%', '√'];
    const binaryOperators = ['/', 'x', '-', '+'];
    const numbers = new RegExp("[0-9]") // regex previously included '.' as well, however this caused every other `numbers.test(input)` to fail
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
const numberPress = numberPressed => {
    if (numberPressed === '.') { // decimals need to be handled a little differently
        if (!currentRightNum) currentRightNum = leftNum; // allows for most recent result to be updated with decimal point
        if (currentRightNum.includes('.')) numberPressed = ''; // prevents more than one decimal point being added
    } 
    // 'if truthy' expression ensures null does not remain as part of the number being displayed (i.e. "null801.22")
    (currentRightNum === null) ? currentRightNum = numberPressed : currentRightNum += numberPressed;
    setDisplay(currentRightNum); // see Update Display section below
};

// when a unary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
const unaryOperatorPress = unaryPressed =>  {
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
        let operand = null;
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
const binaryOperatorPress = binaryPressed => {
    let operand1 = +leftNum, operand2 = +currentRightNum;
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
const equalsPress = () => {
    let operand1 = +leftNum, operand2 = null;
    if (leftNum && currentOperator && currentRightNum) {
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
const performBinaryOperation = (val1, operator, val2) => {
    let output = null;
    switch (operator) {
        case ('+'): output = val1 + val2; break
        case ('-'): output = val1 - val2; break
        case ('x'): output = val1 * val2; break
        case ('/'): output = val1 / val2; break
        default: console.log('Error - binary input not found, input was', operator);
    }
    return (output*1).toString(); // the *1 eliminates any unneccessary trailing 0s
};

const cancel = () => {
    resetAll();
    clearDisplay();
};

// * -- Update Display:

const display = document.getElementById('screen-display');

// takes in a string (representing a number) and renders this in the calculator's display
const setDisplay = numberAsString => {
    let displayValue = numberAsString
    // handle floats in order to fit number displayed to screen, if very large float (>99999999) display error, else trim down
    if (numberAsString.includes('.')) (numberAsString.indexOf('.') > 9) ? displayValue ="err" : displayValue = numberAsString.slice(0, 8);
    // handle large ints / very small floats
    if (displayValue.length > 8 || numberAsString.includes('e')) displayValue = "err"; // stops value being displayed from overlapping the screen
    // then set display:
    display.innerText = displayValue;
}

const clearDisplay = () => display.innerText = '';

// * -- Change Modes:

const modeChangeButtons = document.getElementsByClassName('control-button');
const styleSheet = document.getElementById('current-stylesheet');
let currentStylesheet = styleSheet.getAttribute('href');

// light mode:
const setLightMode = () => styleSheet.setAttribute('href', 'css/lightmode.css')
modeChangeButtons[0].addEventListener('click', setLightMode);

// dark mode:
const setDarkMode = () => styleSheet.setAttribute('href', 'css/nightmode.css')
modeChangeButtons[1].addEventListener('click', setDarkMode)