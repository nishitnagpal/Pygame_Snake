# Snake
One of those games that do not need an explanation. Using Pygame - a Python library - and arcade style Sprite animation I have designed a simple version of this game. 

The snake can be controlled to eat fruit and score as long as time allows. The player has option to pause the game and start over when the game ends. The game has an introduction message that explains all key bindings making it easier to play the game. 

Further improvements will include:

1. Adding speed control: 

An adjustment slider or horizontal scrollbar with FPS values in a given range calibrated along the slider/scrollbar that user can adjust to control the speed of moving snake before starting the game. This way game can be made much more interesting and harder!!

Another way could be increasing speed of the snake automatically after every level passed. That way the user will start a new level at harder settings making it interesting to progress through various game levels.

2. Options for user to customize the background, snake, fruit or other part of the game animation.  

GitHub Pages primarily supports static content such as HTML, CSS, and JavaScript. Pygame, however, is a Python library that requires a Python interpreter to run, which GitHub Pages does not support natively. Firstly, I created an index.html file to include a canvas for drawing the game and a script reference. Then restructured the Python application using JavaScript. I used HTML5 Canvas for drawing and basic JavaScript for the game logic.
