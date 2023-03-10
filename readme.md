# Mini-project: static webpage calculator        

### Deployed via GitHub pages [here](https://hphilpotts.github.io/miniproject-static-calculator/).         
---       

## Project Aim:       
**Build a working calculator, hosted on a static webpage, using HTML, CSS and vanilla JS.**     

I have chosen this mini-project primarily to refresh my familiarity with basic frontend web development, particularly CSS - having spent a lot of time recently on pure JavaScript or Python coding practice, I wanted to avoid skills atrophy in areas such as styling and project disciplines.       
- _N.B.: Project later converted to TypeScript in order to consolidate learning in this area too!_     

By choosing a static site, I have removed a lot of complexity in terms of hosting my project (thanks to GitHub Pages) - this will allow me to use my (sadly limited) time more efficiently.      

Lastly, with the relatively simple choice of project, I am hoping to practise writing simple, clean code from beginning to end!   

<p align="center">
    <img src="img/screengrab2.png" alt="screen grab of light and dark mode side-by-side" width="600">
</p>

## Current issues to resolve/features to be added:          
- _Sound loads very slowly on deployed version when on mobile_. Issue may be to do with limitations of GitHub pages and subsequent workarounds through using my `github.io` repo to host script & sound files, or to inefficiencies in scripts. Possible resolution through pre-loading sound files upon opening / switch to 'daft mode'?        
- Further digging 08/02/23 suggests issue lies with [preload not being enabled with Safari on iOS](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9).      

## Project Progress:        
16/01/23:        
- Initial commit made: I had to look up quite a lot of CSS positioning in order to get going (!) but I am happy with how the outer calculator resizes on various screens.       
- Further structure added: logo, solar panel, margins - mostly achieved through flexbox. Revisting CSS Grid tutorials next as this will be perfect for buttons!     
- Buttons added: used grid to quickly add 20 buttons arranged 4x5, then used table/table-cell to horizontally and vertically centre buttons. Additional styling added such as drab calculator colours for buttons etc.      
- Getting the screen to display: this now fills from the right like a calculator. I've set `font-size` relative to `VH` with 13 seeming to be around the 'magic number' (_it was actually 12 in the end!_). Not sure if this is a great way of doing it but seemed to work nicely!     

- I've now shifted onto the JS. Event listeners added for all buttons, I have decided to use each button's `.innerHTML` property in order to handle clicks.     
- Display now updates when numeric buttons are pressed and wipes when equals is pressed.        
- All button presses now handled by `processButtonPress`. Cancel function added. Some tweaks required where global variables needed to be changed - otherwise I was seeing values persisting even after **=** or **C** were pressed.      
- `processButtonPress` refactored into a switch statement :)        
- Basic calculator functionality now added. Using loads of `console.log`s in order to keep track of how global variables are being changed!     


17/01/23:       
- Now that I'm largely happy with basic functionality, I'm going to have a shot at deploying this. Took quite a few attempts to correctly place and then in turn locate the required `.js` file from my `hphilpotts.github.io` repo, as well as to choose the correct deployment.       
- After a bit of trial end error, and with the use of a separate **deployment** branch, I have been able to get this hosted as a static site via GH Pages. Happy days!        
- Only had a small amount of time to work on this today: the next jobs are to finish completing all functionalities, refactor code, and tweak formatting!        

19/01/23:       
- Formatting updates: display `font-size` now `12vh`. General formatting - updates to colours, shadows etc.     

<p align="center">
    <img src="img/screengrab.png" alt="screenshot of simple web calculator" width="300"/>
</p>

20/01/23:       
- Changed display font, added update to `main.js` that prevents display from overlapping screen.        
- Last result from `evaluateInputs` now saves into variable, allows user to operate on a result: e.g. pressing `2`, `+`, `2`, `=` to get `4` before then pressing `*`, `2`, `=` to get `8` as with a typical simple calculator.     
- `NaN` coming through as `previousResult`, linked to issue where `null` remains in `previousInput`. I've not immediately been able to replicate this issue...! 
- Also seeing error in `evaluateInputs` where no operator is passed in if no operator has been pressed. Simple `if (output)` statement before executing string method prevents errors but causes immediate use of operator following `=` misbehave. Ultimately fixed by changing error message in `default` case to instead save `currentInput` to output.              
- If `=` is first button press, `NaN` comes through. Conditionals added either side of `switch` to handle different scenarios: behaviour now as normal.     
- Next steps: adding unary operators. These are now working, although I have started to see issues with floats - either in terms of very long strings displaying in the display, or where `evaluateInputs` produces integers rather than floats (due, of course, to the use of `parseInt()`). Addressed this second issue through the use of `parseFloat` and a `.slice` method on the display string.      
- Further issue seen where use of unary operators as first input after `=` throws error. Now fixed, but issue seen where sqrt is used with a decimal: shows as `1`. This new issue fixed along with a slew of others seen - used `.toFixed` in both `evaluateInputs` and `unaryOperatorPress`.      
- Last key functionality to add is `.` input. I've realised that I shoud take this out from `binaryOperatorPress` as this needs to be handled differently. A remarkably easy fix! This can in fact be handled through `numberPress`, easy peasy.        
- Another small issue seen where excess zeros are showing on the display for decimals.      

- I'm now going to refactor some of `main.js` before updating the deployed version.         

21/01/23:       
_Two issues, fed back when progress shared_:      
- Width issue fixed (required scrolling on taller, thinner screens). Initially using max of `100vw` but later changed to specific `px` value.       
- `previousInput` now persists on display after binary operator pressed (as with IRL calculator), changing once new number pressed.     

- Now working on adding a dark mode. Currently have a new CSS stylesheet, this can of course be trimmed down. Adding JavaScript to handle this functionality.       

22/01/23:       
- JS functionality added so that light / dark buttons now switch stylesheets. At the moment the entire stylesheet changes over, this could be sharpened up later on. Next step added!       
- Buttons look garbage, next step will be styling these!        

24/01/23:       
- Separated out light/dark mode CSS into separate files, with a third fixed 'style.css' handling styles not relating to view modes.     

25/01/23:       
- Restyled control buttons at top to improve appearance and mobile responsiveness.      

26/01/23:       
- Removed 'daft mode' button until functionality added.     
- _Issue found with latest version... either I have broken the JS at some point or it never worked correctly and I've only just found out._
- _This is exactly why I want to learn testing...!_     

27/01/23:       
- After discovering a major issue yesterday (i.e. the calculator can't do maths) I've decided to rewrite my `main.js` file from the ground up. I feel I had overcomplicated things as I fixed bugs and added functionality, so will go back to basics - albeit with a clearer idea of how I want the logic to run.        
- Rewrite proceeding reasonably well: consecutive binary operations / equals presses or combinations of the two are working.        
- Further functionality added - odd combinations of operators now work. **+/-** now working as well. Refactoring time, I think!                

30/01/23:       
- Continued refactoring, then resolving issues created as a result of refactoring.      

31/01/23:       
- Started converting to TypeScript. First challenge is allowing my global variables to be nullable. Considering either changing approach (and not using `null`), or changing `strictNullChecks` compiler flag.      
- Decided to go with changing `strictNullChecks` - not sure if this is best practice but I've found enough articles that suggest that this is fine when starting out.       

01/02/23:       
- Finished converting `mainRewrite.js` to TS, compiled and working ok in `main`.
- Tried adding haptic feedback upon button press but ran into issues - found out from articles that Safari does not support this.       

02/02/23:       
- Starting work on 'daft' mode: basic html structure added, initially `display: none`.       

03/02/23:       
- JS logic added to handle change from regular modes to 'daft' mode, screen updates.        
- Audio now plays. Next task is adding interesting functionality to upper buttons.      

04/02/23:       
- Animation added to button presses.        
- Adding play all functionality - initial issues found where previous `play()` interrupted immediately by next. Then, found that `forEach()` is not compatible with `async`. Eventually rewritten using `for (..in...)` and working ok. `catch()` added to `audioElement.play()` within `handleSound()` in order to prevent repeated console errors from appearing where a sound being played is interrupted by the next.       
- Play random sound functionality added.     

05/02/23:       
- Play faster functionality added, latest version deployed. Sound currently not playing in deployed version:        

<p align="center">
    <img src="img/errors_grab.png" alt="image of console errors relating to sound playback issues" />       
</p>

- Issue resolved through relocating sound files to `hphilpotts.github.io/docs/` and updating respective path(s) in deployed version / deployment script.        
- New issue identified, however, where sounds load slowly when deployed version accessed via mobile. Issue may be due to either inefficiencies in code, or shortcomings in the workarounds used to deploy as a static site via GH pages.

- Minor refactoring completed on daftmode script. Comments added to clarify process.        

---     