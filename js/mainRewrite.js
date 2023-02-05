// MAIN SCRIPT 2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var leftNum = null; // the number (as string) on the left hand side of the sum - will also be used to store the number most recently evaluated
var currentRightNum = null; // the number (as string) on the right hand side of a sum, currently being input by used
var prevRightNum = null; // the previously input currentRightNum (storing this allows repeated press of `=` to repeat previous operation)
var currentOperator = null; // the most recently pressed operator, held ready for eval in the event of `=` or binary operator press
var prevOperator = null; // the previously used binary operator, allows for repeated press of `=` 
var resetAll = function () {
    leftNum = null;
    currentRightNum = null;
    prevRightNum = null;
    currentOperator = null;
    prevOperator = null;
};
// * -- Event listeners and handle button click:
var buttons = document.querySelectorAll(".button-inner");
var click = document.getElementById('click');
click.volume = 0.3; // setting in JS as no volume attribute supported by browsers
// Get button innerHTML string, pass this as input to processButtonPress:
function handleClick() {
    click.play();
    var buttonPress = this.innerHTML;
    processButtonPress(buttonPress); // see section immediately below:
}
;
buttons.forEach(function (button) { return button.addEventListener('click', handleClick); });
// * -- Processing button presses:
// input is the innerHTML from the button being pressed, passed from handleClick() above:
var processButtonPress = function (input) {
    // button innerHTML strings grouped by type (with respective functions to run for each type)
    var unaryOperators = ['+/-', '%', '√'];
    var binaryOperators = ['/', 'x', '-', '+'];
    var numbers = new RegExp("[0-9]"); // regex previously included '.' as well, however this caused every other `numbers.test(input)` to fail
    switch (true) {
        case (numbers.test(input) || input === '.'): // decimal can be mostly handled the same way as a number (press): i.e. as string
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
            break; // ? can equalsPress be integrated into binaryOperatorPress?
        case (input === 'C'):
            cancel();
            break;
        default:
            console.log("Error - button pressed not caught, input was", input); // default case to catch bad input
    }
};
// when number button is pressed, take the number pressed (as string), join on to to currentRightNum string and set display accordingly: 
var numberPress = function (numberPressed) {
    if (numberPressed === '.') { // decimals need to be handled a little differently
        if (!currentRightNum)
            currentRightNum = leftNum; // allows for most recent result to be updated with decimal point
        if (currentRightNum.includes('.'))
            numberPressed = ''; // prevents more than one decimal point being added
    }
    // 'if truthy' expression ensures null does not remain as part of the number being displayed (i.e. "null801.22")
    (currentRightNum === null) ? currentRightNum = numberPressed : currentRightNum += numberPressed;
    setDisplay(currentRightNum); // see Update Display section below
};
// when a unary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
var unaryOperatorPress = function (unaryPressed) {
    if (unaryPressed === '+/-') { // despite also being a unary operator, it turns out '+/-' needs to be handled differently
        switch (true) {
            case (currentRightNum != null): // if there is currentRightNum then operate on this
                currentRightNum = (-currentRightNum).toString();
                setDisplay(currentRightNum);
                break;
            case (currentOperator != null): // otherwise, if currentOperator, user will be modifying new currentRightNum yet to be added
                currentRightNum = '-';
                setDisplay(currentRightNum);
                break;
            case (leftNum != null): // if neither of the above, user is trying to modify result saved as LH num and showing in display
                leftNum = (-leftNum).toString();
                setDisplay(leftNum);
                break;
            default: // default case means no other relevant inputs stored: operator is first button pressed following clear / load
                currentRightNum = '-';
                setDisplay(currentRightNum);
        }
    }
    else { // other unary operators are handled simply:
        var operand = null;
        (!currentRightNum) ? operand = +leftNum : operand = +currentRightNum;
        switch (unaryPressed) {
            case '%':
                operand = operand / 100;
                break;
            case '√':
                operand = Math.sqrt(operand);
                break;
            default: console.log('Error - unary input not found, it was', unaryPressed);
        }
        currentRightNum = operand.toString();
        setDisplay(currentRightNum);
    }
};
// when a binary operator is pressed, determine from string passed in what operation to perform, then evaluate, then update globals: 
var binaryOperatorPress = function (binaryPressed) {
    var operand1 = +leftNum, operand2 = +currentRightNum;
    if (leftNum && currentOperator && currentRightNum) { // if sum already present in saved vars, evaluate and save binaryPressed as new currentOperator
        leftNum = performBinaryOperation(operand1, binaryPressed, operand2); // see function below equalsPress()
        currentOperator = binaryPressed;
        prevRightNum = currentRightNum;
        currentRightNum = null;
        setDisplay(leftNum);
    }
    else if (currentRightNum) { // if there is a currentRight num
        leftNum = currentRightNum;
        currentOperator = binaryPressed;
        currentRightNum = null;
    }
    else if (leftNum) {
        currentOperator = binaryPressed;
    }
};
// TODO - either incorporate into binaryOperatorPress or break down into functions accessible to both equalsPress and binaryOperatorPress
var equalsPress = function () {
    var operand1 = +leftNum, operand2 = null;
    if (leftNum && currentOperator && currentRightNum) {
        operand2 = +currentRightNum;
        leftNum = performBinaryOperation(operand1, currentOperator, operand2);
        prevOperator = currentOperator;
        currentOperator = null;
        prevRightNum = currentRightNum;
        currentRightNum = null;
    }
    else if (leftNum && currentOperator && prevRightNum) {
        operand2 = +prevRightNum;
        leftNum = performBinaryOperation(operand1, currentOperator, operand2);
    }
    else if (leftNum && prevOperator && prevRightNum) {
        operand2 = +prevRightNum;
        leftNum = performBinaryOperation(operand1, prevOperator, operand2);
    }
    setDisplay(leftNum);
};
// Used in both binaryOperatorPress and equalsPress:
var performBinaryOperation = function (val1, operator, val2) {
    var output = null;
    switch (operator) {
        case ('+'):
            output = val1 + val2;
            break;
        case ('-'):
            output = val1 - val2;
            break;
        case ('x'):
            output = val1 * val2;
            break;
        case ('/'):
            output = val1 / val2;
            break;
        default: console.log('Error - binary input not found, input was', operator);
    }
    return (output * 1).toString(); // the *1 eliminates any unneccessary trailing 0s
};
var cancel = function () {
    resetAll();
    clearDisplay();
};
// * -- Update Display:
var display = document.getElementById('screen-display');
// takes in a string (representing a number) and renders this in the calculator's display
var setDisplay = function (numberAsString) {
    var displayValue = numberAsString;
    // handle floats in order to fit number displayed to screen, if very large float (>99999999) display error, else trim down
    if (numberAsString.includes('.'))
        (numberAsString.indexOf('.') > 9) ? displayValue = "err" : displayValue = numberAsString.slice(0, 8);
    // handle large ints / very small floats
    if (displayValue.length > 8 || numberAsString.includes('e'))
        displayValue = "err"; // stops value being displayed from overlapping the screen
    // then set display:
    display.innerText = displayValue;
};
var clearDisplay = function () { return display.innerText = ''; };
// * -- Change Modes:
var modeChangeButtons = document.getElementsByClassName('control-button');
var styleSheet = document.getElementById('current-stylesheet');
var currentStylesheet = styleSheet.getAttribute('href');
// light mode:
var setLightMode = function () {
    if (styleSheet.getAttribute('href') === 'css/daftmode.css')
        clearDisplay(); // clear display if daft mode previously selected
    styleSheet.setAttribute('href', 'css/lightmode.css');
};
modeChangeButtons[0].addEventListener('click', setLightMode);
// dark mode:
var setDarkMode = function () {
    if (styleSheet.getAttribute('href') === 'css/daftmode.css')
        clearDisplay();
    styleSheet.setAttribute('href', 'css/nightmode.css');
};
modeChangeButtons[1].addEventListener('click', setDarkMode);
// daft mode:
var setDaftMode = function () {
    styleSheet.setAttribute('href', 'css/daftmode.css');
    startDaftMode();
};
modeChangeButtons[2].addEventListener('click', setDaftMode);
var startDaftMode = function () {
    clearDisplay();
    resetAll();
    var daftButtons = document.querySelectorAll(".daft-button-inner");
    function handleDaftClick() {
        var daftButtonPress = this.innerHTML;
        processDaftClick(daftButtonPress);
    }
    daftButtons.forEach(function (button) { return button.addEventListener('click', handleDaftClick); });
    var soundInputs = ['work it', 'harder', 'make it', 'better', 'do it', 'faster', 'makes us', 'stronger', 'more than', 'ever', 'hour', 'after', 'our', 'work is', 'never', 'over'];
    var processDaftClick = function (input) {
        var specialDaftButtons = ['play', 'random', 'faster', 'stop'];
        if (specialDaftButtons.includes(input)) {
            switch (input) {
                case ('play'):
                    console.log('play pressed');
                    playAllSound(550);
                    break;
                case ('random'):
                    var randomSound = soundInputs[Math.floor(Math.random() * soundInputs.length)];
                    handleSound(randomSound);
                    break;
                case ('faster'):
                    playAllSound(390);
                    break;
                default:
                    null;
            }
        }
        else {
            handleSound(input);
        }
    };
    var handleSound = function (input) {
        var audioElement = document.getElementById('audio');
        display.innerHTML = input;
        var audioFile = "/sounds/" + (input.replace(' ', '_') + '.wav');
        audioElement.setAttribute('src', audioFile);
        audioElement.play().catch();
    };
    function playAllSound(delayLength) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            function halt() { haltFunc = true; }
            var delay, haltFunc, _d, soundInputs_1, soundInputs_1_1, soundInput, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        delay = function (ms) { return new Promise(function (res) { return setTimeout(res, ms); }); };
                        haltFunc = false;
                        '';
                        document.getElementById('stop').addEventListener('click', halt);
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 9, 10, 15]);
                        _d = true, soundInputs_1 = __asyncValues(soundInputs);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, soundInputs_1.next()];
                    case 3:
                        if (!(soundInputs_1_1 = _e.sent(), _a = soundInputs_1_1.done, !_a)) return [3 /*break*/, 8];
                        _c = soundInputs_1_1.value;
                        _d = false;
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, , 6, 7]);
                        soundInput = _c;
                        if (haltFunc)
                            return [2 /*return*/];
                        return [4 /*yield*/, delay(delayLength)];
                    case 5:
                        _e.sent();
                        handleSound(soundInput);
                        if (haltFunc)
                            return [2 /*return*/];
                        return [3 /*break*/, 7];
                    case 6:
                        _d = true;
                        return [7 /*endfinally*/];
                    case 7: return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _e.trys.push([10, , 13, 14]);
                        if (!(!_d && !_a && (_b = soundInputs_1.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _b.call(soundInputs_1)];
                    case 11:
                        _e.sent();
                        _e.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    }
};
//# sourceMappingURL=mainRewrite.js.map