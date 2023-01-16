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
- Getting the screen to display: this now fills from the right like a calculator. I've set font size relative to VH with 13 seeming to be around the 'magic number'. Not sure if this is a great way of doing it but seemed to work nicely!     

- I've now shifted onto the JS. Event listeners added for all buttons, I have decided to use each button's `.innerHTML` property in order to handle clicks.     
- Display now updates when numeric buttons are pressed and wipes when equals is pressed.        

