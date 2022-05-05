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
// doors
var doors = [];

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

var speed = 7;

// globals for text box
var textIndex = 0;
var maxTexts = 2;

// globals for selection box
var selectedChoiceIndex = 0;
var maxChoices = 2;
var submitSelection = true;

// globals for interactionCSVs
var currentlyInteracting = false;
var multipleInteractions = false;
var interactionIndex = 0;
var librarianTables = [];
var volunteerTables = [];

// globals for Quest and Storyline;
var storyline;
var advanceStory = false;
var questNum = 0;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  storyline = new Storyline();
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---
  standing_imgs[0] = loadImage('assets/walk-down.png');
  standing_imgs[1] = loadImage('assets/walk-up.png');
  standing_imgs[2] = loadImage('assets/walk-side.png');
  //---
  librarianTables[0] = loadTable('data/librarianQuest1.csv', 'csv', 'header');
  librarianTables[1] = loadTable('data/librarianQuest2.csv', 'csv', 'header');
  librarianTables[2] = loadTable('data/librarianQuest2b.csv', 'csv', 'header');

  volunteerTables[0] = loadTable('data/volunteerQuest1.csv', 'csv', 'header')
  volunteerTables[1] = loadTable('data/volunteerQuest2.csv', 'csv', 'header')
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


  adventureManager.changeState("Map5");
  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
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
  let positionText = "x: " + mouseX + " y: " + mouseY;
  text(positionText,50,50);
  storyline.checkForAdvances();  

  if (keyIsDown(32)) {
    if (currentlyInteracting) {
      interactionIndex ++;
      console.log(interactionIndex);
    }
  }

  if (keyIsDown(16)) {
    this.speed = 12;
  } else {
    this.speed = 7;
  }
}

function resetState() {
  // console.log("state changed");
  interactionIndex = 0;
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

//-- MODIFY THIS: this is an example of how I structured my code. You may
// want to do it differently
function mouseReleased() {
  if( adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Instructions");
  } else {
    textIndex ++;
    if (currentlyInteracting) {
      interactionIndex ++;
      console.log(interactionIndex);
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    selectedChoiceIndex ++;
  } else if (keyCode === UP_ARROW) {
    selectedChoiceIndex --;
  } else if (keyCode === 13) {
    console.log("returned");
    submitSelection = true;
  }

  if (selectedChoiceIndex < 0) {
    selectedChoiceIndex = maxChoices;
  } else if (selectedChoiceIndex > maxChoices) {
    selectedChoiceIndex = 0;
  }

}

/* =============================== TEXT FUNCTIONS =============================== */
// screen size: 1000 x 800

function textBox( string , top) {
  if (string === "") {
    return;
  }
  push();
  
  textSize(16);
  let yPos = 650;
  if (top) {
    yPos = 50
  }
  rect(100, yPos, 800, 100, 10);
  text(string, 120, yPos + 20, 760, 60);
  pop();
}

function selectTextBox( prompt, choices, selected, leftAlign) {
  push();
  textSize(16);

  let xPos = 800;
  if (leftAlign) {
    xPos = 50;
  }

  let boxHeight = 95 + (choices.length * 20);

  rect(xPos, 50, 150, boxHeight, 10);
  text(prompt, xPos + 20, 70, 110, 160);
  for( let i = 0 ; i < choices.length ; i ++) {
    var buffer = choices[i];
    if (selected === i) {
      buffer = buffer.concat(" <");
    }

    text(buffer , xPos + 20, 120  + (i * 20) , 110, 160);
  }
  pop();
  

}

//-------------- CLICKABLE CODE  ---------------// 
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

clickableButtonOnOutside = function () {
  this.color = "#AAAAAA";
}

//--- TEMPLATE STUFF: Don't change 
clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}



//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

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


// -------- Library ---------

class LibraryExterior extends PNGRoom {
  preload() {
    // create door sprite
    this.door = new DoorSprite("Library", 580, 517, 2);
  }

  draw() {
    super.draw();
    drawSprite(this.door.sprite);
    playerAvatar.sprite.overlap(this.door.sprite, this.doorCollision);
  }

  doorCollision(spriteA, spriteB) {
    // teleport to library
    playerAvatar.sprite.position.x = width/2;
    playerAvatar.sprite.position.y = height;
    console.log("moved to : " + height + ", " + width/2);
    adventureManager.changeState("Library");
  }
}

class LibraryInterior extends PNGRoom {
  preload() {
    this.librarianDesk = new NPC("Librarian", 190, 700);
    this.librarianDesk.loadInteractions(librarianTables[questNum]);

    this.computer = new NPC("Computer", 623, 322);
    this.computer.addInteractions(["Booting up", "...", "A few moments later", "I think this looks good! I hope the manager likes it."]);

    this.shelf = new NPC("Shelf", 86, 473);
    this.shelf.addInteractions(["Hmm where could this book be...", "A-C ... perhaps a little further down", "D-F ... almost there", "G-I ... Let's check here", "'How to Nail your interview' This looks like the one!"]);
  }

  draw() {
    super.draw();
    drawSprite(this.librarianDesk.sprite);
    
    if (storyline.storyIndex === 4) {
      this.computer.displayInteractions(playerAvatar);
    } else if (storyline.storyIndex === 5) {
      this.shelf.displayInteractions(playerAvatar);
    } else {
      this.librarianDesk.displayInteractions(playerAvatar);
    }
    
  }
}

// -------- Shelter ---------

class ShelterExterior extends PNGRoom {
  preload() {
    // door sprite
    this.door = new DoorSprite("Shelter", 455, 565, 2);
  }

  draw() {
    super.draw();
    drawSprite(this.door.sprite);
    playerAvatar.sprite.overlap(this.door.sprite, this.doorCollision);
  }

  doorCollision(spriteA, spriteB) {
    // teleport to library if youve talked to the librarian
    if (storyline.shelterLocked) {
      textBox("Hmm this door is locked", false);
    } else {
      playerAvatar.sprite.position.x = width/2;
      playerAvatar.sprite.position.y = height;
      console.log("moved to : " + height + ", " + width/2);
      adventureManager.changeState("Shelter");
    }
    
  }
}

class ShelterInterior extends PNGRoom {
  preload() {
    this.volunteerDesk = new NPC("Volunteer", 190, 700);
    this.volunteerDesk.loadInteractions(volunteerTables[questNum]);
  }

  draw() {
    super.draw();
    drawSprite(this.volunteerDesk.sprite);
    this.volunteerDesk.displayInteractions(playerAvatar);
  }
}

// 290 610
class RestaurantExterior extends PNGRoom {
  preload() {
    // door sprite
    this.door = new DoorSprite("Restaurant", 292, 580, 1);
  }

  draw() {
    super.draw();
    drawSprite(this.door.sprite);
    playerAvatar.sprite.overlap(this.door.sprite, this.doorCollision);
  }

  doorCollision(spriteA, spriteB) {
    // teleport to library if youve talked to the librarian
    if (false) {
      textBox("Hmm this door is locked", false);
    } else {
      playerAvatar.sprite.position.x = width/2;
      playerAvatar.sprite.position.y = height;
      console.log("moved to : " + height + ", " + width/2);
      adventureManager.changeState("Grill");
    }
    
  }
}


class DishMinigame extends PNGRoom {
  preload() {
    this.plate = new Dish(3);
  }

  draw() {
    this.plate.draw();
    this.plate.checkCollisions();
  }

  exitGame() {
    // teleport to library
    playerAvatar.sprite.position.x = width/2;
    playerAvatar.sprite.position.y = height;
    console.log("moved to : " + height + ", " + width/2);
    adventureManager.changeState("Map4");
  }
}

class GrillMinigame extends PNGRoom {
  preload() {
    // define class varibles here, load images or anything else
    this.grill = new Grill();
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our code adter this
  draw() {
    // this calls PNGRoom.draw()
    super.draw();
    // Add your code here
    this.grill.draw();
  }

  exitGame() {
    // teleport to library
    playerAvatar.sprite.position.x = width/2;
    playerAvatar.sprite.position.y = height;
    console.log("moved to : " + height + ", " + width/2);
    adventureManager.changeState("Map4");
  }
}