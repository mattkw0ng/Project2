/***********************************************************************************
  Avatar Classes

  Uses the p5.play library with Avatar and other classes

  This class is a TEMPLATE for you to modify in your other code.

  Avatar Class:
    - will automatically mirror when you change the speed of the avatar
    - you can change the speed of the avatar
    - set positions for each one
    - do collision-detection
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.avatar.js"></script>
***********************************************************************************/

// Animated character
class Avatar  {
  // gets called with new keyword
  constructor(name, x, y) {
    this.name = name;
    this.sprite = createSprite(x, y);
    
    this.maxSpeed = 6;
    this.hasStandingAnimation = false;
    this.hasMovingAnimation = false;

    // no grabables
    this.grabbable = undefined;

    // make avatar still
    this.setSpeed(0,0);
  }

   // adds a moving animation (optional)
   addMovingAnimation(startPNGPath, endPNGPath) {
    this.sprite.addAnimation('walking', startPNGPath, endPNGPath);
    this.hasMovingAnimation = true;
    this.currentAnimation = 'walking';
  }

  // adds a standing animation (optional)
  addStandingAnimation(startPNGPath, endPNGPath) {
    this.sprite.addAnimation('standing', startPNGPath, endPNGPath);
    this.hasStandingAnimation = true;
  }

  setPosition(x,y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
  }

  // store max speed in a class variable, so that we never go past this number
  setMaxSpeed(num) {
    this.maxSpeed = num;
  }

  // return name of current grabble, empty string if none
  getGrabbableName() {
    if( this.grabbable === undefined ) {
      return "";
    }
    else {
      return this.grabbable.name;
    }
  }

  // set current speed, flip sprite, constain to max, change animations
  setSpeed(xSpeed,ySpeed) {
    // flip sprite depending on direction
    if( xSpeed > 0 ) {
      this.sprite.mirrorX(1);
    }
    else {
      this.sprite.mirrorX(-1);
    }

    if( this.hasStandingAnimation ) {
      this.sprite.changeAnimation('standing');
    }

    // may need to optimize this
    if( xSpeed === 0 && ySpeed === 0 && this.hasStandingAnimation ) {
      this.sprite.changeAnimation('standing');
    }
    else if( this.hasMovingAnimation ) {
      this.sprite.changeAnimation('walking');
    }
    
    // set to xSpeed and constrain to max speed
    this.sprite.velocity.x = constrain(xSpeed, -this.maxSpeed, this.maxSpeed );
    this.sprite.velocity.y = constrain(ySpeed, -this.maxSpeed, this.maxSpeed );
  }

  // a sprite (or avatar to check overlap with)
  overlap(overlapSprite, callback) {
    if( overlapSprite === undefined ) {
      console.log("early return");
      return;
    }

   this.overlap(overlapSprite.sprite, callback );
  }

  // accessor function to give avatar a grabbable
  clearGrabbable() {
    this.grabbable = undefined;
  }

  // accessor function to give avatar a grabbable
  setGrabbable(grabbable) {
    this.grabbable = grabbable;
  }

  // if avatar has a grabble, update the position of that grabbable
  // call every draw loop
  update() {
    if( this.grabbable !== undefined ) {
      this.grabbable.sprite.position.x = this.sprite.position.x + 10;
      this.grabbable.sprite.position.y = this.sprite.position.y + 10;
    }
  }

  // draws the name, an optional feature
  drawLabel() {
    textSize(12);
    fill(240);
    text(this.name, this.sprite.position.x + 20, this.sprite.position.y + 10 );
  }
}

// 2D sprite which we will be able to pick up and dropp
class Item {
  // call upon preload() of p5.js to acutally load the image
  constructor(x, y, img) {
    this.sprite = createSprite(x, y);
    this.sprite.mouseActive;
    this.sprite.setDefaultCollider();
    this.inInventory = false;
    this.isHovered = false;
    this.sprite.addImage('static', img );
  }

  draw() {
    if (this.inInventory) {
      drawSprite(this.sprite);
      this.sprite.mouseUpdate();
      this.isHovered = this.sprite.mouseIsOver && this.inInventory;
    }
  }
}

class DoorSprite {
  constructor(name, x, y, size) {
    this.name = name;
    this.sprite = createSprite(x, y);
    this.sprite.height = 55;
    // this.sprite.visible = false;
    if (size === 1) {
      this.sprite.width = 40;
    } else {
      this.sprite.width = 80;
    }
    this.sprite.visible = false;
  }
}

class Bed {
  constructor(x,y) {
    this.sprite = createSprite(x,y);
  }

  checkCollision(target) {
    target.overlap(this.sprite, this.handleCollision);
  }

  handleCollision(spriteA, spriteB) {
    if (storyline.completedDailyTasks()) {
      textBox("Ready for bed? press [z] to confirm")
      if (keyIsDown(90) && !dayComplete) {
        dayComplete = true;
      }
    } else if (!currentlyNarrating && !currentlyTalkingToSon){
      textBox("Rosie: I'm not tired yet.");
    }
  }
}

class Narrator {
  constructor() {
    this.lines = [];
  }

  // load lines and set narration to true
  loadLines(arr) {
    this.lines = arr;
    if (this.lines !== null) {
      currentlyNarrating = true;
    }
  }

  speak(top) {
    if (currentlyNarrating && narrationIndex < this.lines.length) {
      textBox(this.lines[narrationIndex], top);
    } else {
      this.active = false;
      currentlyNarrating = false;
      narrationIndex = 0;
    }
  }
}

class Son extends Avatar {
  constructor(name, x, y, pngPath) {
    super(name, x, y);
    this.atSchool = false;
    this.following = true;
    this.slowDown = 2.5;
    this.offsetX = 55;
    this.offsetY = 10;

    this.lines = [];
  }

  // load lines and set narration to true
  loadLines(arr) {
    console.group("added new lines for son " + arr);
    this.lines = arr;
    if (this.lines !== null) {
      currentlyTalkingToSon = true;
    }
  }

  speak(top) {
    if (!this.atSchool && currentlyTalkingToSon && talkingToSonIndex < this.lines.length) {
      textBox(this.lines[talkingToSonIndex], top);
    } else if (talkingToSonIndex >= this.lines.length) {
      storyline.sonDialogue = false;
      currentlyTalkingToSon = false;
      talkingToSonIndex = 0;
    }
  }

  setAttractionPoint(x,y) {
    // allow buffer to prevent jitter
    let buffer = 1;
    
    if (this.sprite.position.x > x + buffer) {
      // currently to the right || move sprite to the left
      this.sprite.velocity.x = -(speed - this.slowDown);
    } else if (this.sprite.position.x < x - 10) {
      // currently to the left || move sprite to the right
      this.sprite.velocity.x = (speed - this.slowDown);
    } else {
      this.sprite.velocity.x = 0;
    }

    if (this.sprite.position.y > y + buffer) {
      // currently down || move sprite up
      this.sprite.velocity.y = -(speed - this.slowDown);
    } else if (this.sprite.position.y < y - 10) {
      // currently up || move sprite down
      this.sprite.velocity.y = (speed - this.slowDown);
    } else {
      this.sprite.velocity.y = 0;
    }
  }

  teleport() {
    this.sprite.position.x = playerAvatar.sprite.position.x + this.offsetX;
    this.sprite.position.y = playerAvatar.sprite.position.y + this.offsetY;
  }

  dropOff() {
    this.atSchool = true;
    this.following = false;
    this.sprite.visible = false;
  }

  pickUp() {
    this.atSchool = false;
    this.following = true;
    this.sprite.visible = true;
    this.teleport();
  }

  // check if sprite is next to player
  isBeside() {
    return this.sprite.velocity.y + this.sprite.velocity.x === 0 && !this.atSchool;
  }

  setAnimation() {
    if (this.sprite.velocity.y + this.sprite.velocity.x === 0) {
      this.sprite.changeImage('standing');
    } else {
      this.sprite.changeAnimation('walking');
    }
  }

  draw() {
    if (this.following) {
      // Should follow to the right or left of the player avatar
      if (direction === 2) {
        this.offsetX = 55;
      } else if (direction === 3) {
        this.offsetX = - 55;
      }
      this.setAttractionPoint(playerAvatar.sprite.position.x + this.offsetX, playerAvatar.sprite.position.y + this.offsetY);

      this.setAnimation();
      drawSprite(this.sprite);
    }
    this.speak(true);
  } 
}

/*
  NPC Class
*/

class NPC extends Avatar {
  constructor(name, x, y, pngPath) {
    super(name, x, y);
    this.interactionsArray = [];
    this.doneInteracting = false;
    this.canAdvance = true;
    this.showHint = false;

    this.interIndex = 0;
    this.isActive = false;
    this.displayMessage = 'Press \'e\' to interact!'
    if(pngPath != null) {
      this.img = loadImage(pngPath);
    }
    //Quest related instance variables
    this.hasQuest = false;
    this.questItem = null;
    this.questFinished = false;
    this.questSuccess = null;
    this.questFailure = null;
  }

  // Same as StaticSprite class, to support static NPCs
  setup() {
    this.sprite.addImage('static', this.img );
    console.log(this.sprite);
  }

  // Initializes the parameters for a Quest NPC from given parameters.
  setupQuest(questItem, questSuccessMsg, questFailureMsg) {
    this.questItem = questItem;
    this.questSuccess = questSuccessMsg;
    this.questFailure = questFailureMsg;
    this.questStarted = true;
    this.hasQuest = true;
  }

  loadInteractions(table) {
    console.log(table);
    if(table.getColumn('index') && table.getColumn('interaction')) {
      console.log("adding interactions");
      for(let i = 0; i < table.getRowCount(); i++) {
        this.interactionsArray.push(table.getString(i, 'interaction'));
        console.log(table.getString(i, 2));
      }  
    }
  }

  // Adds multiple interactions from string arr
  addInteractions(interactions) {
    this.interactionsArray = interactions;
  }

  // Adds a single interaction to the array, should be a string parameter.
  addSingleInteraction(interaction) {
    this.interactionsArray.push(interaction);
  }

  displayInteractions(target) {
    if(target.sprite.overlap(this.sprite) && interactionIndex < this.interactionsArray.length && !currentlyNarrating) {
      if (this.doneInteracting) {
        if (this.showHint) {
          // if done interacting, show a hint of what to do next
          textBox(storyline.currentHint, true);
        }
        
      } else {
        currentlyInteracting = true;
        textBox(this.interactionsArray[interactionIndex], true);
      }
      
    } else {
      // done interacting
      if (interactionIndex >= this.interactionsArray.length) {
        // console.log("interaction index: " + interactionIndex);
        // advance story if this is the first time going through the interactions
        if (!this.doneInteracting) {
          advanceStory = this.canAdvance && true;
        }
        
        // make sure we only advance once
        this.doneInteracting = true;
      }
      currentlyInteracting = false;
    }

    if (!target.sprite.overlap(this.sprite) && this.doneInteracting) {
      this.showHint = true;
    }

  }

  displayInteractPrompt(target) {
    push();
    // Only displays the interact prompt or current dialogue of the NPC when the player 
    // avatar is overlapping the NPC sprite.
    if(target.sprite.overlap(this.sprite)) {
      textBox(this.displayMessage, true);
      

      // This is the 'e' key, but you can change it to any key you'd prefer. Just make sure 
      // you also update that key in the keyPressed function in sketch.js!
      if(keyCode === 69) {
        // This variable is to ensure that only one NPC is active at a time. Without this,
        // having multiple NPCs on a single screen may cause some bugs in the progression of
        // their individual dialogue.
        this.isActive = true;
        // Keeps an NPC from moving when they're being interacted with. Haven't tested yet, but
        // the idea is to be able to have NPCs that walk around on a set path. If you interact 
        // with an NPC during its cycle, it'll pause. Still thinking about how to continue the 
        // cycle afterwards.
        this.setSpeed(0,0);
        // Check's if this NPC is a Quest NPC, if their quest has been completed, and if the
        // player avatar is holding a grabbable.
        if(this.hasQuest && !this.questFinished && target.getGrabbableName() != "") {
          // If the player has the valid quest item, display the success message and end the quest.
          if(target.getGrabbableName() === this.questItem) {
            this.displayMessage = this.questSuccess;
            this.questFinished = true;
          }
          // If the player does not have the valid quest item, display the failure message and keep
          // the quest going.
          else {
            this.displayMessage = this.questFailure;
          }
        }
        // If the player has completed the quest, default to the success message for all future interactions.
        else if (this.questFinished) {
          this.displayMessage = this.questSuccess;
        }
        // If the player has no grabbable and has not completed the quest OR this NPC is not a Quest NPC, 
        // display the current message in the interaction array.
        else {
          this.displayMessage = this.interactionsArray[this.interIndex];
        }
      }
    }
    else {
      this.displayMessage = 'Press \'e\' to interact!';
      this.isActive = false;
      // Display a message above an NPC that has a quest, the visual isn't final, just 
      // something to attract the player's attention for now.
      if(!this.questFinished && this.hasQuest) {
        fill('red');
        textSize(20);
        textAlign(CENTER);
        text('I have a quest!', this.sprite.position.x, 
        this.sprite.position.y - this.sprite.height/2 - 25);
      }
    } 
    
    pop();
  }

  // Continues the conversation with an NPC through the interaction array. Quest dialogue 
  // is separately stored in the questSuccess and questFailure variables, so the relevant
  // quest dialogue will appear without worry of this function overwriting it.
  continueInteraction() {
    if(this.isActive) {
      if(this.interIndex < this.interactionsArray.length-1) {
        this.interIndex++;
      }
    }
  }

  // Check for player avatar overlapping an NPC sprite and if that NPC and if that NPC 
  // is the current active NPC (only 1 at a time);
  isInteracting(target) {
    return target.sprite.overlap(this.sprite) && this.isActive;
  }
}