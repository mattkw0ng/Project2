/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

//--- TEMPLATE STUFF: Don't change

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;
// 0 = up | 1 = down | 2 = left | 3 = right
var direction = 1;
var standing_imgs = [];

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

//---

//-- MODIFY THIS for different speeds
var speed = 10;

//--- Your globals would go here


// Allocate Adventure Manager with states table and interaction tables
function preload() {
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---
  standing_imgs[0] = loadImage('assets/walk-down.png');
  standing_imgs[1] = loadImage('assets/walk-up.png');
  standing_imgs[2] = loadImage('assets/walk-side.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1000, 800);

  //--- TEMPLATE STUFF: Don't change
  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();
  //---

  // MODIFY THIS: change to initial position
  playerAvatar = new Avatar("Player", 640, 400);
   
  // MODIFY THIS: to make your avatar go faster or slower
  playerAvatar.setMaxSpeed(20);

  // MODIFY THIS: add your filenames here, right now our moving animation and standing animation are the same
  playerAvatar.sprite.addImage('standing-down', standing_imgs[0]);
  playerAvatar.sprite.addAnimation('walk-down', 'assets/walk-down-01.png', 'assets/walk-down-04.png')
  playerAvatar.sprite.addImage('standing-up', standing_imgs[1]);
  playerAvatar.sprite.addAnimation('walk-up', 'assets/walk-up-01.png', 'assets/walk-up-04.png')
  playerAvatar.sprite.addImage('standing-side', standing_imgs[2]);
  playerAvatar.sprite.addAnimation('walk-side', 'assets/walk-side-01.png', 'assets/walk-side-04.png')

  //--- TEMPLATE STUFF: Don't change
  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
  //--
}

// Adventure manager handles it all!
function draw() {
  //--- TEMPLATE STUFF: Don't change
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
  //---

  //--- MODIFY THESE CONDITONALS
  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" ) {
      
    //--- TEMPLATE STUFF: Don't change    
    // responds to keydowns
    checkMovementAdvanced();

    // this is a function of p5.play, not of this sketch
    drawSprite(playerAvatar.sprite);
    //--
  } 
}

function checkMovementAdvanced() {
  // Check x movement
  if(keyIsDown(D_KEY)) {
    // D
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('walk-side');
    direction = 3;
    playerAvatar.sprite.velocity.x = speed;
  }
  else if(keyIsDown(A_KEY)) {
    // A
    playerAvatar.sprite.mirrorX(-1);
    playerAvatar.sprite.changeAnimation('walk-side');
    direction = 2;
    playerAvatar.sprite.velocity.x = -speed;
  }
  else {
    checkDirection();
    playerAvatar.sprite.velocity.x = 0;
  }

  // Check y movement
  if(keyIsDown(S_KEY)) {
    // S
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('walk-down');
    direction = 1;
    playerAvatar.sprite.velocity.y = speed;

  }
  else if(keyIsDown(W_KEY)) {
    // W
    playerAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('walk-up');
    direction = 0;
    playerAvatar.sprite.velocity.y = -speed;
  }
  else {
    playerAvatar.sprite.velocity.y = 0;
  }
}

function checkDirection() {
  if (direction === 0 ) {
    playerAvatar.sprite.changeImage('standing-up');
  } else if (direction === 1 ) {
    playerAvatar.sprite.changeImage('standing-down');
  } else {
    playerAvatar.sprite.changeImage('standing-side');
  } 
}

//--- TEMPLATE STUFF: Don't change 
// respond to W-A-S-D or the arrow keys
function checkMovement() {
  var xSpeed = 0;
  var ySpeed = 0;

  // Check x movement
  if(keyIsDown(RIGHT_ARROW) || keyIsDown(D_KEY)) {
    xSpeed = speed;
  }
  else if(keyIsDown(LEFT_ARROW) || keyIsDown(A_KEY)) {
    xSpeed = -speed;
  }
  
  // Check y movement
  if(keyIsDown(DOWN_ARROW) || keyIsDown(S_KEY)) {
    ySpeed = speed;
  }
  else if(keyIsDown(UP_ARROW) || keyIsDown(W_KEY)) {
    ySpeed = -speed;
  }

  playerAvatar.setSpeed(xSpeed,ySpeed);
}
//--

//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
function mouseReleased() {
  if( adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
  }
}


//-------------- CLICKABLE CODE  ---------------//

//--- TEMPLATE STUFF: Don't change 
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}
//--

//-- MODIFY THIS:
// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

//-- MODIFY THIS:
// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}
//



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

//-- MODIFY THIS:
// Change for your own instructions screen

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsText = "You are navigating through the interior space of your moods. There is no goal to this game, but just a chance to explore various things that might be going on in your head. Use the ARROW keys to navigate your avatar around.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(30);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

//-- MODIFY THIS: for your own classes
// (1) copy this code block below
// (2) paste after //-- done copy
// (3) Change name of TemplateScreen to something more descriptive, e.g. "PuzzleRoom"
// (4) Add that name to the adventureStates.csv file for the classname for that appropriate room
class TemplateScreen extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();

    // Add your code here
  }
}
//-- done copy

