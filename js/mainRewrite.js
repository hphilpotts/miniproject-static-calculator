// MAIN SCRIPT, RE-WRITTEN
// TODO - convert to TS

// * -- Global variables:
let leftNum= null; // the number (as string) on the left hand side of the sum - will also be used to store the number most recently evaluated
let currentRightNum = null; // the number (as string) on the right hand side of a sum, currently being input by used
let prevRightNum = null; // the previously input currentRightNum (storing this allows repeated press of `=` to repeat previous operation)
let currentOperator = null; // the most recently pressed operator
let prevOperator = null;

const logGlobalVariables = () => console.log(`left num: ${leftNum}, current op: ${currentOperator}, current Rnum: ${currentRightNum}, prev op: ${prevOperator}, prev Rnum: ${prevRightNum}`)

// Full reset of all Global variables to null
const resetAll = () => {
    leftNum = null; currentRightNum = null; prevRightNum = null; currentOperator = null; prevOperator = null;
}


// * -- Event listeners and handle button click:

const buttons = document.querySelectorAll(".button-inner");

// Get button innerHTML string, pass this as input to Processing Button Presses in section immediately below):
function handleClick(){
    logGlobalVariables();
    buttonPress = this.innerHTML;
    console.log(`[${buttonPress}] pressed ---`);
    processButtonPress(buttonPress);
};

buttons.forEach(button => button.addEventListener('click', handleClick));

// * -- Processing button presses:

// input is the innerHTML from the button being pressed, passed from handleClick() above:
const processButtonPress = input => {

    // button innerHTML strings grouped by type (with respective functions to run for each type)
    const unaryOperators = ['+/-', '%', '√'];
    const binaryOperators = ['/', 'x', '-', '+'];
    const numbers = new RegExp("[0-9]") // regex previously included '.' as well, however this caused every other `numbers.test(input)` to fail

    // console.log('Processing button press...');
    switch (true) {
        case (numbers.test(input) || input === '.'): // decimal can be handled the same way as a number (press): i.e. as string
            // console.log(input, 'matched numbers regex, performing numberPress...');
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
    logGlobalVariables();
    console.log('-----------');
};

// when number button is pressed, take the number pressed (as string), join on to to currentRightNum string and set display accordingly: 
const numberPress = numberPressed => {
    // console.log(numberPressed, 'was passed in to numberPress');
    if (numberPressed === '.') {
        if (!currentRightNum) currentRightNum = leftNum;
        if (currentRightNum.includes('.')) numberPressed = '';
    } 
    // if truthy expression ensures null does not remain as part of the number being displayed (i.e. "null8")
    (currentRightNum === null) ? currentRightNum = numberPressed : currentRightNum += numberPressed;
    setDisplay(currentRightNum);
};

// when a unary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
const unaryOperatorPress = unaryPressed =>  {
    if (unaryPressed === '+/-') {
        if (currentRightNum) {
            currentRightNum = (-currentRightNum).toString();
            setDisplay(currentRightNum);
        } else if (currentOperator) {
            currentRightNum = '-';
            setDisplay(currentRightNum);
        } else if (leftNum) {
            leftNum = (-leftNum).toString();
            setDisplay(leftNum);
        } else {
            currentRightNum = '-';
            setDisplay(currentRightNum);
        }
    } else {
            // first save unary press as most recent operator:
        currentOperator = unaryPressed;

        // establish operand - if no right number then reuse left number (allows for repeat operation)
        let operand = null;
        (!currentRightNum) ? operand = +leftNum : operand = +currentRightNum;

        // determine which unary operator was pressed based upon string value passed in:
        switch (unaryPressed) {
            case '%': operand = operand / 100; break
            case  '√': operand = Math.sqrt(operand); break
            default: console.log('Error - unary input not found, it was', unaryPressed);
        }

        // TODO establish what to do with prevRightNum - what do I set this based on, if at all?

        leftNum = operand.toString();
        currentRightNum = null;
        setDisplay(leftNum);

    }


}

// when a binary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
const binaryOperatorPress = binaryPressed => {
    let output = null; operand1 = null, operand2 = null;

    const performBinaryOperation = binaryToUse => {
        console.log(`Doing: ${operand1} ${binaryToUse} ${operand2}...`)
        switch (binaryToUse) {
            case ('+'): output = operand1 + operand2; break
            case ('-'): output = operand1 - operand2; break
            case ('x'): output = operand1 * operand2; break
            case ('/'): output = operand1 / operand2; break
            default: console.log('Error - binary input not found, input was', binaryToUse);
        }

        output = (output*1).toString(); // the *1 eliminates any unneccessary trailing 0s
        console.log('...output from binaryOperatorPressed is', output);
    }

    if (leftNum && currentOperator && currentRightNum) {
        console.log('Consecutive binary operation!');
        operand1 = +leftNum;
        operand2 = +currentRightNum;
        performBinaryOperation(currentOperator);
        leftNum = output; // ! check that this works
        currentOperator = binaryPressed;
        prevRightNum = currentRightNum;
        currentRightNum = null;
        setDisplay(leftNum);
    } else if (currentRightNum) {
        console.log('Only found current right num which is', currentRightNum);
        leftNum = currentRightNum;
        currentOperator = binaryPressed;
        currentRightNum = null;
    } else if (leftNum) {
        console.log('Only a left num found which is', leftNum);
        currentOperator = binaryPressed;
    }

}

// TODO - either incorporate into binaryOperatorPress or break down into functions accessible to both equalsPress and binaryOperatorPress
const equalsPress = () => {
    let output = null; operand1 = null, operand2 = null;

    const performBinaryOperation = binaryToUse => {
        switch (binaryToUse) {
            case ('+'): output = operand1 + operand2; break
            case ('-'): output = operand1 - operand2; break
            case ('x'): output = operand1 * operand2; break
            case ('/'): output = operand1 / operand2; break
            default: console.log('Error - binary input not found, input was', binaryPressed);
        }
        output = (output*1).toString();

        console.log('Output from equalsPress is', output);
    }

    if (leftNum && currentOperator && currentRightNum) {
        console.log('Equals pressed, LNum and COp and CRnum found:');
        operand1 = +leftNum;
        operand2 = +currentRightNum;
        performBinaryOperation(currentOperator);
        leftNum = output; // ! check that this works
        prevOperator =  currentOperator;
        currentOperator = null;
        prevRightNum = currentRightNum;
        currentRightNum = null;
        setDisplay(leftNum);
    } else if (leftNum && currentOperator && prevRightNum) {
        console.log('Equals pressed again, LNum and COp found, reusing PRNum:');
        operand1 = +leftNum;
        operand2 = +prevRightNum;
        performBinaryOperation(currentOperator);
        leftNum = output; // ! check that this works
        setDisplay(leftNum);
    } else if (leftNum && prevOperator && prevRightNum) {
        console.log('Found left num, reusing prevOp and prevR');
        operand1 = +leftNum;
        operand2 = +prevRightNum;
        performBinaryOperation(prevOperator);
        leftNum =  output;
        setDisplay(leftNum);
    }
}

const handleTrailingZeros = floatAsString => {

    console.log('There be trailing zeros!');

    let output = floatAsString;

    const trimDecimalZeros = (str) => {
        if (str.endsWith('0')) {
            str.slice(0, -1);
            trimDecimalZeros(str);
        }
    }

    trimDecimalZeros(output);

    return output;
}

const cancel = () => {
    resetAll();
    clearDisplay();
}

// * -- Update Display:

const display = document.getElementById('screen-display');

// takes in a string (representing a number) and renders this in the calculator's display
const setDisplay = numberAsString => {
    console.log('Unfiltered number as string:', numberAsString);
    let displayValue = numberAsString

    // handle floats in order to fit number displayed to screen
    if (numberAsString.includes('.')){
        (numberAsString.indexOf('.') > 9) ? displayValue ="err" : displayValue = numberAsString.slice(0, 8);
    }

    // handle large ints:
    if (displayValue.length > 8) displayValue = "err"; // stops value being displayed from overlapping the screen

    // otherwise set display:
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