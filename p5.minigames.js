/* =================== Dish Washing minigame =================== */

class DishWasher {
  constructor() {
    this.score = 0;
    this.timer = new Timer(15000);
    this.startGame = false;
    this.dish = new Dish(3);
    this.recordedScore = false;
  }

  draw() {
    if (!this.startGame) {
      this.start();
    } else if (this.timer.expired() && !this.recordedScore) {
      // record the score, lock the restaurant
      console.log("Game Over: " + this.score);
      storyline.dishScore += this.score;
      storyline.workedToday = true;
      storyline.restaurantLocked = true;
      this.recordedScore = true;
      return;
    }

    if (this.dish.isDone()) {
      this.dish = new Dish(3);
      this.score ++;
    }
    this.dish.draw();
    this.drawUI();
  }

  start() {
    this.startGame = true;
    this.timer.start()
  }

  drawUI() {
    push();
    rectMode(CENTER);
    textAlign(CENTER);
    rect(width/2,0,200,140,10);
    let message = this.timer.getRemainingTimeFormatted();
    
    textSize(36);
    text(message,width/2,45);
    text(this.score,950,300);
    pop();
  }
}

class Dish {
  constructor(numStains) {
    this.maxStains = numStains;
    this.stainsCleaned = 0;
    this.stainSprites = [];
    this.plate = createSprite(500, 500);
    this.plate.width = 500;
    this.plate.height = 500;
    for( let i = 0 ; i < this.maxStains ; i ++) {
      let x = Math.random()*500 + 250;
      let y = Math.random()*500 + 250;
      this.stainSprites[i] = createSprite(x, y);
      this.stainSprites[i].mouseActive;
      this.stainSprites[i].setDefaultCollider();
    }
  }

  checkCollisions() {
    for( let i = 0 ; i < this.maxStains ; i ++) {
      this.stainSprites[i].mouseUpdate();
      if(this.stainSprites[i].mouseIsOver && this.stainSprites[i].mouseIsPressed && this.stainSprites[i].score !== -1) {
        console.log("cleaned");
        this.stainSprites[i].score = -1;
        this.stainSprites[i].visible = false;
        this.stainsCleaned ++;
      }
    }

    if(this.isDone()) {
      this.cleanup();
    }
  }

  isDone() {
    return this.stainsCleaned === this.maxStains;
  }

  cleanup() {
    this.plate.remove();
    for ( let i = 0 ; i < this.maxStains ; i ++) {
      this.stainSprites[i].remove();
    }
  }

  draw() {
    this.checkCollisions();
    drawSprite(this.plate);
    for ( let i = 0 ; i < this.maxStains ; i ++) {
      drawSprite(this.stainSprites[i]);
    }
  }
}
  
/* =================== Grill minigame =================== */

class Grill {
  constructor() {
    // Grill minigame
    this.stack = createSprite(50,400);
    this.stack.mouseActive;
    this.stack.setDefaultCollider();

    this.plate = createSprite(950,400);
    this.plate.mouseActive;
    this.plate.setDefaultCollider();

    this.trashcan = createSprite(950, 600);
    this.trashcan.mouseActive;
    this.trashcan.setDefaultCollider();

    this.spatula = createSprite(mouseX, mouseY);
    this.spatula.visible = false;

    this.emptySpatula = true;
    this.burgers = [];
    this.burgerCount = 0;
    this.selected = 0;
    this.score = 0;
    this.timer = new Timer(60000); // 1 minute timer
    this.startGame = false;
    this.recordedScore = false;

    this.mouseWasPressed = false;
    this.mouseClicked = false;
    this.hoverStack = false;
  }

  draw() {
    drawSprite(this.stack);
    drawSprite(this.plate);
    drawSprite(this.trashcan);

    // spatula will follow mouse position
    this.spatula.position.x = mouseX;
    this.spatula.position.y = mouseY;
    drawSprite(this.spatula);

    this.checkCollisions();
    this.drawUI();
  }

  start() {
    this.startGame = true;
    this.timer.start()
  }

  checkCollisions() {
    if (!this.startGame) {
      this.start();
    } else if (this.timer.expired() && !this.recordedScore) {
      // record the score, lock the restaurant
      console.log("Game Over: " + this.score);
      storyline.grillScore += this.score;
      storyline.workedToday = true;
      storyline.restaurantLocked = true;
      this.recordedScore = true;
      return;
    }

    this.stack.mouseUpdate();
    this.plate.mouseUpdate();
    this.trashcan.mouseUpdate();
    this.hoverStack = this.stack.mouseIsOver || this.plate.mouseIsOver || this.trashcan.mouseIsOver ;
    
    // if player clicks on the stack, create a new burger
    if (this.registerClick(this.stack) && this.emptySpatula) {
      console.log("creating new burger");
      if (!this.startGame) {
        console.log("timer started");
        // begring the game when the player first clicks on the stack
        this.timer.start();
        this.startGame = true;
      }

      this.burgers[this.burgerCount] = new Burger(this.burgerCount);
      this.select(this.burgerCount);
      this.burgerCount ++;

      // make sure code doesnt run continuously
      this.mouseWasPressed = true;
    }

    if (this.startGame) {
      this.drawBurgers();

      // if the player drags the burger over to teh plate or trash, handle these collisions
      this.checkSubmit();
      
      // call burger.check() on each burger
      this.checkBurgers()
    }
  }

  checkBurgers() {
    let found = false;
    for (let i = 0; i < this.burgerCount ; i ++) {
      // burger.check() returns bolean to tell if it has been picked up
      if (!this.burgers[i].done) {
        let temp = this.burgers[i].check(this.emptySpatula, this.hoverStack);
        
        if (temp >= 0) {
          this.select(temp);
          found = true;
        }
      }
    }

    this.emptySpatula = !found;
  }

  checkSubmit() {
    this.plate.mouseUpdate();
    this.trashcan.mouseUpdate();

    let burger = this.burgers[this.selected];
    if (!this.emptySpatula) {
      if ( this.registerClick(this.plate) ){
        if (burger.status === "fully-cooked") {
          console.log("successfully submitted - " + this.selected);
          this.score++;
          burger.done = true;
          burger.destroy();
          this.emptySpatula = true;
        } else {
          console.log("burger is not done")
        }
      } else if ( this.registerClick(this.trashcan) ) {
        console.log("threw away burger - " + this.selected);
        burger.done = true;
        burger.destroy();
        this.emptySpatula = true;
      }
    }
  }

  // helper functions
  select(index) {
    this.selected = index;
  }

  drawBurgers() {
    for (let i = 0; i < this.burgerCount ; i ++) {
      if (!this.burgers[i].done) {
        this.burgers[i].draw();
      }
    }
  }

  drawUI() {
    push();
    rectMode(CENTER);
    textAlign(CENTER);
    rect(width/2,0,200,140,10);
    let message = this.timer.getRemainingTimeFormatted();
    
    textSize(36);
    text(message,width/2,45);
    text(this.score,950,300);
    pop();
  }

  registerClick(sprite) {
    sprite.mouseUpdate();
    if (sprite.mouseIsOver && sprite.mouseIsPressed)  {
      this.mouseClicked = true;
    } else {
      this.mouseWasPressed = false;
      this.mouseClicked = false;
    }
  
    return this.mouseClicked && !this.mouseWasPressed;
  }

}

// ------------ Burger class ------------ //

/**
 * 1 - create burger when user clicks on stack
 * 2 - timer will start when the user clicks again, also placing the burger down on the grill
 * 3 - when the timer is done, change the state to "half-cooked" and give user another 3 seconds to flip
 * 4 - if flipped, reset timer | after 3 seconds, set state to "cooked", and give user another 3 seconds to take the burger off the grill
 * 5 - if the user picks up the burger in time, they must bring it over to the plate to submit it, 
 *        then call destroy to remove sprite and set done to true to prevent further interaction
 * note - if not flipped or moved, burger should enter "burned" state, and the user needs to move it to the trashcan
 */
class Burger {
  constructor( index ) {
    console.log( "new burger created");
    this.sprite = createSprite(mouseX, mouseY);
    this.sprite.mouseActive;
    this.sprite.setDefaultCollider();

    this.status = "raw"
    this.ready = false;
    this.pickedUp = true;
    this.timer = new Timer(3000, true);
    // raw, half-cooked, cooked, burnt
    this.index = index;
    this.done = false;

    this.mouseWasPressed = false;
    this.mouseClicked = false;
  }

  draw() {
    if (this.pickedUp) {
      this.sprite.position.x = mouseX;
      this.sprite.position.y = mouseY;
    }
    drawSprite(this.sprite);

    //Text
    push();
    textAlign(CENTER)
    text(this.index, this.sprite.position.x, this.sprite.position.y - 12);
    text(this.status, this.sprite.position.x, this.sprite.position.y + 10);
    if (this.ready) {
      fill("red");
    }
    text(this.timer.getRemainingTimeFormatted(), this.sprite.position.x, this.sprite.position.y);
    pop();
  }

  // check mouse actions and other interactions
  check(emptySpatula, hoverStack) {
    this.checkStatus();
    this.sprite.mouseUpdate();
    if( this.registerClick(this.sprite) && !hoverStack ) {
      
      console.log("clicked burger: " + this.index);
      this.mouseWasPressed = true;

      if (this.pickedUp) {
        // put down
        console.log("putting down: " + this.index);
        this.pickedUp = false;
        this.timer.play();
      } else if (this.ready && emptySpatula) {
        this.tryFlip();
      }
      
    } 
    
    if (this.pickedUp) {
      return this.index;
    } else {
      return -1;
    }
  }

  // check timers and update status
  checkStatus() {
    if (this.timer.expired()) {
      if (this.ready && !this.pickedUp) {
        // the burger was previously ready, meaning the player waited too long to flip
        this.status = "burned";
      } else if (this.status === "burned") {
        this.ready = true;
      } else {
        // when the burger is ready, you have another 3 seconds to flip it or move it
        this.ready = true;
        this.timer.start();
      }
    }
  }
  
  tryFlip() {
    // change status
    if (this.status === "raw") {
      this.status = "half-cooked";
      this.ready = false;
      this.timer.start();
    } else if (this.status === "half-cooked") {
      this.status = "cooked";
      this.ready = false;
      this.timer.start();
    } else if (this.status === "cooked") {
      // pick up burger
      this.status = "fully-cooked";
      this.pickedUp = true;
      this.timer.pause();
    } else {
      this.pickedUp = true;
      this.timer.pause();
    }

  }

  registerClick(sprite) {
    sprite.mouseUpdate();
    if (sprite.mouseIsOver && sprite.mouseIsPressed)  {
      this.mouseClicked = true;
    } else {
      this.mouseWasPressed = false;
      this.mouseClicked = false;
    }
  
    return this.mouseClicked && !this.mouseWasPressed;
  }

  destroy() {
    this.sprite.remove();
  }

}