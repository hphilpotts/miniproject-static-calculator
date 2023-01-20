# Miniproject: static webpage calculator        

## Project Aim:       
**Build a working calculator, hosted on a static webpage, using HTML, CSS and vanilla JS.**     

I have chosen this miniproject primarily to refresh my familiarity with frontend web development, particularly CSS - having spent a lot of time recently on pure JavaScript or Python coding practice, I wanted to avoid skills atrophy in areas such as styling and project disciplines.       

By chosing a static site, I have removed a lot of complexity in terms of hosting my project (thanks to GitHub Pages) - this will allow me to use my (sadly limited) time more efficiently.      

Lastly, with the relatively simple choice of project, I am hoping to practice writing simple, clean code from beginning to end!     

## Project Progress:        
16/01/23:        
- Initial commit made: I had to look up quite a lot of CSS positioning in order to get going (!) but I am happy with how the outer calculator resizes on various screens.       
- Further structure added: logo, solar panel, margins - mostly achieved through flexbox. Re-visting CSS Grid tutorials next as this will be perfect for buttons!     
- Buttons added: used grid to quickly add 20 buttons arranged 4x5, then used table/table-cell to horizontally and vertically centre buttons. Additional styling added such as drab calculator colours for buttons etc.      
- Getting the screen to display: this now fills from the right like a calculator. I've set font size relative to VH with 13 seeming to be around the 'magic number' (_it was actually 12 in the end!_). Not sure if this is a great way of doing it but seemed to work nicely!     

- I've now shifted onto the JS. Event listeners added for all buttons, I have decided to use each button's `.innerHTML` property in order to handle clicks.     
- Display now updates when numeric buttons are pressed and wipes when equals is pressed.        
- All button presses now handled by `processButtonPress`. Cancel function added. Some tweaks required where global variables needed to be changed - otherwise I was seeing values persisting even after '=' or 'C' were pressed.      
- `processButtonPress` refactored into a switch statement :)        
- Basic calculator functionality now added. Using loads of `console.log`s in order to keep track of how global variables are being changed!     


17/01/23:       
- Now that I'm largely happy with basic functionality, I'm going to have a shot at deploying this. Took quite a few attempts to correctly place and then in turn locate the required .js file from my hphilpotts.github.io repo, as well as to choose the correct deployment.       
- After a bit of trial end error, and with the use of a separate `deployment` branch, I have been able to get this hosted as a static site via GH Pages. Happy days!        
- Only had a small amount of time to work on this today: the next jobs are to finish completing all functionalites, refactor code, and tweak formatting!        

19/01/23:       
- Formatting updates: display `font-size` now `12vh`. General formatting - updates to colours, shadows etc.     

20/01/23:       
- Changed display font, added update to `main.js` that prevents display from overlapping screen.        
- Last result from `evaluateInputs` now saves into variable, allows user to operate on a result: e.g. pressing `2`, `+`, `2`, `=` to get `4` before then pressing `*`, `2`, `=` to get `8` as with a typical simple calculator.     
- `NaN` coming through as `previousResult`, linked to issue where `null` remains in `previousInput`. I've not immediately been able to replicate this issue...! 
- Also seeing error in `evaluateInputs` where no operator is passed in if no operator has been pressed. Simple `if (output)` statement before executing string method prevents errors but causes immediate use of operator following `=` misbehave. Ultimately fixed by changing error message in `default` case to instead save `currentInput` to output.              
- If `=` is first button press, `NaN` comes through. Conditionals added either side of `switch` to handle different scenarios: behaviour now as normal.     



## Bugs to resolve:       
- NaN coming through as `previousResult`, linked to issue where `null` remains in `previousInput`.      