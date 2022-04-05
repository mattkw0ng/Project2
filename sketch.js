/***********************************************************************************
  HOME avatar example
***********************************************************************************/

// This is a 'sprite' which we can move
var avatar;
var speed = 15;
// 0 = up | 1 = down | 2 = left | 3 = right
var direction = 1;


// The is a static sprite
var standing_imgs = [];

function preload() {
  standing_imgs[0] = loadImage('assets/walk-down.png');
  standing_imgs[1] = loadImage('assets/walk-up.png');
  standing_imgs[2] = loadImage('assets/walk-side.png');
}
// Setup code goes here
function setup() {
  createCanvas(windowWidth, windowHeight);

  // create a sprite with dimensions
  avatar = createSprite(width/2, height/2);

  // This is a *numbered* sequence of PNG files
  // We add animation to different sprites
  avatar.addImage('standing-down', standing_imgs[0]);
  avatar.addAnimation('walk-down', 'assets/walk-down-01.png', 'assets/walk-down-04.png')
  avatar.addImage('standing-up', standing_imgs[1]);
  avatar.addAnimation('walk-up', 'assets/walk-up-01.png', 'assets/walk-up-04.png')
  avatar.addImage('standing-side', standing_imgs[2]);
  avatar.addAnimation('walk-side', 'assets/walk-side-01.png', 'assets/walk-side-04.png')
  // create a star in the middle of the screen
  //star = createSprite(width/2, height/2);
  //star.addImage('star', starImg);

  frameRate(30);
 }

// Draw code goes here
function draw() {
  // could draw a PNG file here
  background(255);

  // trap keyboard arrow keys
  checkMovement();

  // drawSprites is a function in p5.play, draws all the sprites
  drawSprites();
}

// This will reset position
function keyPressed() {
  if( key === ' ') {
    avatarCollision();
  }
}

function checkMovement() {
  // Check x movement
  if(keyIsDown(68)) {
    // D
    avatar.mirrorX(1);
    avatar.changeAnimation('walk-side');
    direction = 3;
    avatar.velocity.x = speed;
  }
  else if(keyIsDown(65)) {
    // A
    avatar.mirrorX(-1);
    avatar.changeAnimation('walk-side');
    direction = 2;
    avatar.velocity.x = -speed;
  }
  else {
    checkDirection();
    avatar.velocity.x = 0;
  }

  // Check y movement
  if(keyIsDown(83)) {
    // S
    avatar.mirrorX(1);
    avatar.changeAnimation('walk-down');
    direction = 1;
    avatar.velocity.y = speed;
    
  }
  else if(keyIsDown(87)) {
    // W
    avatar.mirrorX(1);
    avatar.changeAnimation('walk-up');
    direction = 0;
    avatar.velocity.y = -speed;
  }
  else {
    avatar.velocity.y = 0;
  }
}

function checkDirection() {
  if (direction === 0 ) {
    avatar.changeImage('standing-up');
  } else if (direction === 1 ) {
    avatar.changeImage('standing-down');
  } else {
    avatar.changeImage('standing-side');
  } 
}

// SpriteA is the sprite in question, spriteA will be ghost in this case
// SpriteB is the one that it collided with
function avatarCollision(spriteA, spriteB) {
  avatar.position.x = width/2;
  avatar.position.y = height/2;
  //spriteB.remove();
}