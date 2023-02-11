// * * MODE FUNCTIONALITY:
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
// Allow changes between different modes: light mode, dark mode, 'daft' mode. Light mode and dark mode being self-explanatory, daft mode changes calculator into a 'Daft Punk' soundboard. (n.b. - currently seeing issues with sound playback when deployed version accessed on mobile.)
// 'daft' mode sections:
// - setDaftMode
// - startDaftMode
// click event listener & handle click function
// processDaftClick
// handleSound
// playAllSound
import { clearDisplay, display, resetAll } from "./main.js";
var modeChangeButtons = document.getElementsByClassName('control-button');
var styleSheet = document.getElementById('current-stylesheet');
// * -- light mode:
var setLightMode = function () {
    if (styleSheet.getAttribute('href') === 'css/daftmode.css')
        clearDisplay(); // clear display if daft mode previously selected
    styleSheet.setAttribute('href', 'css/lightmode.css');
};
modeChangeButtons[0].addEventListener('click', setLightMode);
// * -- dark mode:
var setDarkMode = function () {
    if (styleSheet.getAttribute('href') === 'css/daftmode.css')
        clearDisplay();
    styleSheet.setAttribute('href', 'css/nightmode.css');
};
modeChangeButtons[1].addEventListener('click', setDarkMode);
// * -- daft mode:
// sets display to 'daft mode', css file hides calculator buttons div and displays soundboard div before running `startDaftMode` function below:
var setDaftMode = function () {
    styleSheet.setAttribute('href', 'css/daftmode.css');
    startDaftMode();
};
modeChangeButtons[2].addEventListener('click', setDaftMode);
// runs in `setDaftMode` above, runs additional script to allow soundboard buttons to function:
var startDaftMode = function () {
    // select and preload all daft audio sound elements when daft mode started:
    // * attempting to speed up audio load / play times on mobile...
    var daftAudio = document.getElementById('daft-audio').getElementsByTagName('audio');
    for (var i = 0; i < daftAudio.length; i++) {
        daftAudio[i].preload = "auto";
    }
    ;
    clearDisplay(); // remove any value displayed from when used as calculator
    resetAll(); // clear all global variables - preventing inputs from 'persisting' from one calculator session to another.
    // click event listener for soundboard buttons and handle click function, innerHTML passed to `processDaftClick` below:
    var daftButtons = document.querySelectorAll(".daft-button-inner");
    function handleDaftClick() {
        var daftButtonPress = this.innerHTML; // get innerHTML to pass as string in function below:
        processDaftClick(daftButtonPress); // see section below
    }
    daftButtons.forEach(function (button) { return button.addEventListener('click', handleDaftClick); });
    // take innerHTML from button press and process accordingly:
    var processDaftClick = function (input) {
        var specialDaftButtons = ['play', 'random', 'faster', 'stop']; // 'special buttons' from top row have specific functions
        if (specialDaftButtons.includes(input)) { // if a special button, select functionality to be used:
            switch (input) {
                case ('play'):
                    playAllSound(550); // see below - iterates over soundInputs (array mirroring all non-special button innerHTML values), in effect simulating user pressing all buttons in order. Param is the delay in ms between playing the next sound
                    break;
                case ('random'): // play sound at random.
                    var randomSound = soundInputs[Math.floor(Math.random() * soundInputs.length)];
                    handleSound(randomSound);
                    break;
                case ('faster'):
                    playAllSound(390); // as play above, but with a shorter delay between sounds.
                    break;
                default:
                    // stop pressed, no special functionality required unless playAllSounds running - see halt() within playAllSounds below
                    null;
            }
        }
        else { // non special buttons handled as per handleSound function below:
            handleSound(input);
        }
    };
    // handle a non-special button press / simulate a non-special button press when called in `playAllSound` below:
    var handleSound = function (input) {
        var audioID = input.replace(' ', '_');
        var audioElement = document.getElementById(audioID); // select correct element
        display.innerHTML = input; // set 'calculator' display screen to reflect button that has been pressed
        audioElement.play().catch();
        // empty catch prevents mutiple console errors triggered when audio play in progress is interrupted by another
    };
    // soundInputs used for playAllSound below - array mirrors the innerHTML values from all special buttons in L-R, T-B order.
    var soundInputs = ['work it', 'harder', 'make it', 'better', 'do it', 'faster', 'makes us', 'stronger', 'more than', 'ever', 'hour', 'after', 'our', 'work is', 'never', 'over'];
    // plays all sounds with a delay between each set using delayLength parameter in ms
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
                        ; // when haltFunc changed to true stop running (see returns below)
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
                            return [2 /*return*/]; // return halts function (accessed when stop button pressed)
                        return [4 /*yield*/, delay(delayLength)];
                    case 5:
                        _e.sent();
                        handleSound(soundInput);
                        if (haltFunc)
                            return [2 /*return*/]; // as above, placed other side of delay to minimise gap between stop being pressed and function halting
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
//# sourceMappingURL=modes.js.map