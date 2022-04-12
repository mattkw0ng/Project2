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
class StaticSprite {
  // call upon preload() of p5.js to acutally load the image
  constructor(name, x, y, pngPath) {
    this.name = name;
    this.img = loadImage(pngPath);
    this.sprite = createSprite(x, y);
  }

  setup() {
    this.sprite.addImage('static', this.img );
  }
}