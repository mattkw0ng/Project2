/***********************************************************************************
  Project 2
  by Matt Kwong

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerAvatar;
var sonAvatar;
var narrator;

// 0 = up | 1 = down | 2 = left | 3 = right
var direction = 1;
var standing_imgs = [];
// doors
var doors = [];

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// keycods for W-A-S-D
var movementLocked = false;
const W_KEY = 87;
const S_KEY = 83;
const D_KEY = 68;
const A_KEY = 65;

var speed = 7;

// globals for text box
var textIndex = 0;
var maxTexts = 2;
var bodyFont;
var titleFont;

// globals for selection box
var selectedChoiceIndex = 0;
var maxChoices = 2;
var submitSelection = false;
var loadingScreen;

// globals for interactionCSVs
var currentlyInteracting = false;
var currentlyNarrating = false;
var currentlyTalkingToSon = false;
var interactionIndex = 0;
var narrationIndex = 0;
var talkingToSonIndex = 0;
var librarianTables = [];
var librarianIndex = 0
var volunteerTables = [];
var volunteerIndex = 0
var managerTables = [];
var managerIndex = 0;

// globals for Quest and Storyline;
var tutorial = false;
var storyline;
var inventory;
var advanceStory = false;
var dayComplete = false;
var questNum = 0;
var quiz;
var gameOver = false;

var jumpTo = 0;

//globals for minigames
var burgerImages = [];
var stain;
var itemImages = [];
var star;


// Allocate Adventure Manager with states table and interaction tables
function preload() {
  storyline = new Storyline();
  quiz = new Quiz();
  //--- TEMPLATE STUFF: Don't change
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  //---
  standing_imgs[0] = loadImage('assets/walk-down-01.png');
  standing_imgs[1] = loadImage('assets/walk-up-01.png');
  standing_imgs[2] = loadImage('assets/walk-side-01.png');
  standing_imgs[3] = loadImage('assets/son-01.png');
  //---
  librarianTables[0] = loadTable('data/librarianQuest1.csv', 'csv', 'header');
  librarianTables[1] = loadTable('data/librarianQuest2.csv', 'csv', 'header');
  librarianTables[2] = loadTable('data/librarianQuest2b.csv', 'csv', 'header');

  volunteerTables[0] = loadTable('data/volunteerQuest1.csv', 'csv', 'header');
  volunteerTables[1] = loadTable('data/volunteerQuest2.csv', 'csv', 'header');
  volunteerTables[2] = loadTable('data/volunteerQuest2b.csv', 'csv', 'header');
  volunteerTables[3] = loadTable('data/volunteerQuest2c.csv', 'csv', 'header');

  managerTables[0] = loadTable('data/managerQuest1.csv', 'csv', 'header');
  managerTables[1] = loadTable('data/managerQuest2.csv', 'csv', 'header');
  managerTables[2] = loadTable('data/managerQuest2b.csv', 'csv', 'header');
  managerTables[3] = loadTable('data/managerQuest2c.csv', 'csv', 'header');
  managerTables[4] = loadTable('data/managerQuest2d.csv', 'csv', 'header');

  burgerImages[0] = loadImage('assets/burger-raw.png');
  burgerImages[1] = loadImage('assets/burger-half-cooked.png');
  burgerImages[2] = loadImage('assets/burger-cooked.png');
  burgerImages[3] = loadImage('assets/burger-burnt.png');

  stain = loadImage('assets/stain.png');

  itemImages[0] = loadImage('assets/flashdrive.png');
  itemImages[1] = loadImage('assets/book.png');
  itemImages[2] = loadImage('assets/resume.png');
  itemImages[3] = loadImage('assets/lease.png');

  star = loadImage('assets/interact-symbol.png');

  inventory = new Inventory();
  bodyFont = loadFont("fonts/MinecraftRegular-Bmg3.otf");
  titleFont = loadFont("fonts/Krungthep.ttf");
}

// Setup the adventure manager
function setup() {
  createCanvas(1000, 800);
  clickables = clickablesManager.setup();

  playerAvatar = new Avatar("Player", 640, 400);
  sonAvatar = new Son("Son", 665, 400);
  sonAvatar.dropOff(); // son starts off at school
  narrator = new Narrator();
  loadingScreen = new LoadingScreen(0.1);
   
  playerAvatar.setMaxSpeed(20);

  playerAvatar.sprite.addImage('standing-down', standing_imgs[0]);
  playerAvatar.sprite.addAnimation('walk-down', 'assets/walk-down-01.png', 'assets/walk-down-04.png')
  playerAvatar.sprite.addImage('standing-up', standing_imgs[1]);
  playerAvatar.sprite.addAnimation('walk-up', 'assets/walk-up-01.png', 'assets/walk-up-04.png')
  playerAvatar.sprite.addImage('standing-side', standing_imgs[2]);
  playerAvatar.sprite.addAnimation('walk-side', 'assets/walk-side-01.png', 'assets/walk-side-04.png')

  sonAvatar.sprite.addImage('standing', standing_imgs[3]);
  sonAvatar.sprite.addAnimation('walking', 'assets/son-01.png', 'assets/son-04.png');

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerAvatar.sprite);
  adventureManager.setPlayerSprite2(sonAvatar.sprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();


  // adventureManager.changeState("DishMinigame");
  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Background" && 
      adventureManager.getStateName() !== "Goal"){
    checkMovementAdvanced();
    drawSprite(playerAvatar.sprite);
    sonAvatar.draw();
  } 

  if (!loadingScreen.active) {
    narrator.speak();
    inventory.draw();
  }
  
  devModeFunctions();

  storyline.checkDayCycle();
  storyline.checkForAdvances();  

  loadingScreen.draw();

  // special function to advance storyline 
  storyline.advanceStory(jumpTo);
}

// Hacks for quicker navigation during development
function devModeFunctions() {
  
  // pressing 'control' gives access to devmode functions
  if (keyIsDown(17)) {
    // Display some useful data
    devInfoDisplay();
    
    // 't' teleports to given state
    if (keyIsDown(84)) {
      let newState = prompt("teleport to: ");
      adventureManager.changeState(newState);
    }

    // '.' allows you to skip through the story
    if (keyIsDown(190)) {
      quiz.passed = true;
      jumpTo = prompt("Jump to state:");
    }

    // execute a command
    if (keyIsDown(191)) {
      let command = prompt("Enter command");
      eval(command);
    }

    // ' ' Skips through dialogue
    if (keyIsDown(32)) {
      if (currentlyInteracting) {
        interactionIndex ++;
        console.log(interactionIndex);
      }
    }
  }

  function devInfoDisplay() {
    rect(0,0,150,100);
    let positionText = "mouse x: " + mouseX + " y: " + mouseY;
    text(positionText,20,25);
    let playerPositionText = "player x: " + playerAvatar.sprite.position.x + " y: " + playerAvatar.sprite.position.y;
    text(playerPositionText,20,40);
    let sonPositionText = "son x: " + sonAvatar.sprite.position.x + " y: " + sonAvatar.sprite.position.y;
    text(sonPositionText,20,55);
    let storylineIndex = "storyline progress: " + (storyline.storyIndex - 1);
    text(storylineIndex,20,70);
    let currDay = "current day " + storyline.currentDay;
    text(currDay,20,85);
  }

  // 'SHIFT' increases player speed
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
  if(movementLocked) {
    //don't do anything
    return;
  }
  // Check x movement
  if(keyIsDown(D_KEY)) {
    // D
    playerAvatar.sprite.mirrorX(1);
    sonAvatar.sprite.mirrorX(1);
    playerAvatar.sprite.changeAnimation('walk-side');
    direction = 3;
    playerAvatar.sprite.velocity.x = speed;
  }
  else if(keyIsDown(A_KEY)) {
    // A
    playerAvatar.sprite.mirrorX(-1);
    sonAvatar.sprite.mirrorX(-1);
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

// Handle mouse clicks
function mouseReleased() {
  if( adventureManager.getStateName() === "Splash") {
    adventureManager.changeState("Background");
  } else if( adventureManager.getStateName() === "Background") {
    adventureManager.changeState("Tutorial");
    playerAvatar.sprite.position.x = 170;
    playerAvatar.sprite.position.y = 645;
  } else if( adventureManager.getStateName() === "Goal") {
    adventureManager.changeState("Map5");
  } else if( adventureManager.getStateName() === "DishTutorial") {
    adventureManager.changeState("DishMinigame");
  } else if( adventureManager.getStateName() === "GrillTutorial") {
    adventureManager.changeState("GrillMinigame");
  } else {
    textIndex ++;
    if (currentlyInteracting) {
      interactionIndex ++;
      console.log("interacting: " + interactionIndex);
    } else if (currentlyNarrating) {
      narrationIndex ++;
      console.log("narrating: " + narrationIndex);
    } else if (currentlyTalkingToSon && !sonAvatar.atSchool) {
      talkingToSonIndex ++;
      console.log("talking to son: " + talkingToSonIndex);
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
  fill('rgba(255,255,255, 0.98)');
  textSize(18);
  textFont(bodyFont);
  let yPos = 650;
  if (top) {
    yPos = 50
  }
  rect(100, yPos, 800, 100, 10);
  fill('#707070');
  text(string, 120, yPos + 20, 760, 60);
  pop();
}

function selectTextBox( prompt, choices, selected, leftAlign) {
  push();
  fill('rgba(255,255,255, 0.98)')
  textSize(18);
  textFont(bodyFont);
  let xPos = 800;
  if (leftAlign) {
    xPos = 50;
  }

  let boxHeight = 95 + (choices.length * 20);

  rect(xPos, 50, 500, boxHeight, 10);
  fill('#707070');
  text(prompt, xPos + 20, 70, 460, 160);
  for( let i = 0 ; i < choices.length ; i ++) {
    var buffer = choices[i];
    if (selected === i) {
      buffer = buffer.concat(" <");
    }

    text(buffer , xPos + 20, 120  + (i * 20) , 460, 160);
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

class TutorialRoom extends PNGRoom {
  preload() {
    this.starSprite = createSprite(750,650);
    this.starSprite.addImage("static", star);
  }

  draw() {
    super.draw();
    drawSprite(this.starSprite);
    playerAvatar.sprite.overlap(this.starSprite, this.handleCollision);
    console.log(tutorial);
    if (tutorial && !currentlyNarrating) {
      console.log("Moving on");
      adventureManager.changeState("Goal");
    }
  }

  handleCollision() {
    if (!tutorial) {
      console.log("Touched the star");
      narrator.loadLines(["Narrator: To advance through this dialogue, click your mouse!", "Narrator: Yup just like that! ", "Narrator: Seems like you got the hang of it, so let's move on."]);
      tutorial = true;
    }
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
    if (playerAvatar.sprite.overlapPoint(580, 490)) {
      //console.log("x: "+ this.door.sprite.position.x + " y: " + this.door.sprite.position.y)
      this.doorCollision();
    };
  }

  doorCollision() {
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
    this.librarianDesk.sprite.visible = false;
    this.librarianDesk.loadInteractions(librarianTables[librarianIndex]);

    this.computer = new NPC("Computer", 623, 322);
    this.computer.sprite.addImage("static", star);
    this.computer.addInteractions(["Booting up", "...", "A few moments later", "I think this looks good! I hope the manager likes it."]);

    this.shelf = new NPC("Shelf", 86, 473);
    this.shelf.sprite.addImage("static", star);
    this.shelf.addInteractions(["Hmm where could this book be...", "A-C ... perhaps a little further down", "D-F ... almost there", "G-I ... Let's check here", "'How to Nail your interview' This looks like the one!"]);
  }

  draw() {
    super.draw();
    
    
    if (storyline.storyIndex === 4) {
      drawSprite(this.computer.sprite);
      this.computer.displayInteractions(playerAvatar);
    } else if (storyline.storyIndex === 5) {
      drawSprite(this.shelf.sprite);
      this.shelf.displayInteractions(playerAvatar);
    } else {
      drawSprite(this.librarianDesk.sprite);
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
    this.volunteerDesk.sprite.visible = false;
    this.bed = new Bed(580,550);
    this.bed.sprite.addImage("static", star);
    this.volunteerDesk.loadInteractions(volunteerTables[volunteerIndex]);
  }

  draw() {
    super.draw();
    drawSprite(this.volunteerDesk.sprite);
    this.volunteerDesk.displayInteractions(playerAvatar);
    this.bed.sprite.visible = storyline.completedDailyTasks();
    drawSprite(this.bed.sprite);
    this.bed.checkCollision(playerAvatar.sprite);
    
  }
}

// -------- Restaurant ---------

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
    if (storyline.restaurantLocked) {
      textBox("I don't have anything to do here right now", false);
      return;
    } else if (!sonAvatar.atSchool) {
      textBox("I should probably drop my son off at school first", false);
      return;
    }
    // teleport to library if youve talked to the librarian
    playerAvatar.sprite.position.x = width/2;
    playerAvatar.sprite.position.y = height;
    console.log("moved to : " + height + ", " + width/2);
    if (storyline.dishMinigame && !storyline.workedToday) {
      adventureManager.changeState("DishTutorial");
    } else if (storyline.grillMinigame && !storyline.workedToday) {
      adventureManager.changeState("GrillTutorial");
    } else {
      adventureManager.changeState("Restaurant");
    }
    
  }
}

class RestaurantInterior extends PNGRoom {
  preload() {
    this.manager = new NPC("Manager", 300, 522);
    this.manager.loadInteractions(managerTables[managerIndex]);
    this.manager.sprite.visible = false;
  }

  draw() {
    this.manager.canAdvance = !storyline.managerLocked;
    super.draw();
    drawSprite(this.manager.sprite);
    if (storyline.displayQuiz) {
      quiz.start();
    } else {
      this.manager.displayInteractions(playerAvatar);
    }
  }
}

// -------- School --------- 

class School extends PNGRoom {
  preload() {
    // door sprite
    //this.door = new DoorSprite("School", 292, 580, 1);
  }

  draw() {
    super.draw();
    // drawSprite(this.door.sprite);
    if (playerAvatar.sprite.overlapPoint(750,450)) {
      this.doorCollision();
    }
  }

  doorCollision() {
    if (sonAvatar.isBeside() && !sonAvatar.atSchool && !storyline.workedToday) {
      // if the son is next to the player at the door of the school, drop him off
      sonAvatar.dropOff();
      narrator.loadLines(["Rosie: Have fun at school today!"]);
    } else if (sonAvatar.atSchool && storyline.workedToday) {
      // if the son is currently at school and the player already worked today, pick him up
      sonAvatar.pickUp();
      if (!storyline.sonDialogue) {
        // if there is no special dialogue, show this simple interaction
        sonAvatar.loadLines(["Rosie: How was school today?", "Son: It was alright..."]);
      }
      
    }
  }
}

// -------- Store --------- 

class Store extends PNGRoom {
  preload() {
    this.shopped = false;
  }

  draw() {
    super.draw();
    // drawSprite(this.door.sprite);
    if (playerAvatar.sprite.overlapPoint(675,550)) {
      this.doorCollision();
    }
  }

  doorCollision() {
    if (!storyline.storeLocked && !this.shopped) {
      textBox("Enter store? (press [e] to enter)");
      if(keyIsDown(69)) {
        narrator.loadLines(["Rosie: Hmm let's check out the boy's section...", "Rosie: How about this shirt?", "Son: I'm not into Minecraft anymore Mom!", "Rosie: Okay okay, my bad! How about this one then?", "Son: ... Can I get this one instead?", "Rosie: Alrighty, as long as you're happy with it!", "Son: Yeah!", "Rosie: Okay let't get going then.", "..."]);
        this.shopped = true;
      }
    } else if (currentlyNarrating && this.shopped)  {
      // hide avatars while "shopping"
      playerAvatar.sprite.visible = false;
      sonAvatar.sprite.visible = false;
      movementLocked = true;
    } else {
      textBox("Nothing to do here right now...");
      playerAvatar.sprite.visible = true;
      sonAvatar.sprite.visible = true;
      movementLocked = false;
    }
  }
}

// -------- Home --------- 

class Home extends PNGRoom {
  preload() {
    this.entered = false;
  }

  draw() {
    super.draw();
    // drawSprite(this.door.sprite);
    if (playerAvatar.sprite.overlapPoint(605,585)) {
      this.doorCollision();
    }

    if (!currentlyNarrating && this.entered && !gameOver) {
      // done with narrators comments
      console.log("~ fin ~");
      gameOver = true;
      loadingScreen.endGame();

      // TODO: Creator's note & endscreen
    }
  }

  doorCollision() {
    if (!storyline.houseLocked && !this.entered) {
      textBox("Finish Game? (press [e] to enter)");
      if(keyIsDown(69)) {
        inventory.paperwork.inInventory = false;
        narrator.loadLines(["Landlord: I heard you have some paperwork for me?", "Rosie: Yup! Here it is.", "...", "Landlord: Alright, everything looks good! Here are the keys to your new apartment!", "...", "Narrator: And that's a wrap!", "Narrator: Thank you for playing, I hope you enjoyed this little adventure!"]);
        this.entered = true;
        playerAvatar.sprite.visible = false;
        sonAvatar.sprite.visible = false;
        movementLocked = true;
      }
    } else if (!gameOver) {
      textBox("Nothing to do here right now...");
    }
  }
}

// -------- Minigames --------- 

class DishMinigame extends PNGRoom {
  preload() {
    this.game = new DishWasher();
  }

  draw() {
    super.draw();
    this.game.draw();
    if (this.game.recordedScore) {
      // when the game is over, move outside;
      this.exitGame();
    }
  }

  exitGame() {
    // move sprite outside
    playerAvatar.sprite.position.x = 293;
    playerAvatar.sprite.position.y = 663;
    console.log("moved to : " + height + ", " + width/2);
    adventureManager.changeState("Map1");
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
    if (this.grill.recordedScore) {
      // when the game is over, move outside;
      this.exitGame();
    }
  }

  exitGame() {
    console.log("Exiting Game");
    // move sprite outside
    playerAvatar.sprite.position.x = 293;
    playerAvatar.sprite.position.y = 663;
    console.log("moved to : " + height + ", " + width/2);
    adventureManager.changeState("Map1");
  }
}