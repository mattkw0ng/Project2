/*******************************************************************************************************************
//
//  Class: Timer
//
//  Written by Scott Kildall 
//	for P5.js
//
//  Modified by Matt Kwong (to include pausing)
//
//------------------------------------------------------------------------------------------------------------------
// - Very simple but incredibly useful timer class
// - Call start() whenever it expires to reset the time
// - Call expired() to check to see if timer is still active
//------------------------------------------------------------------------------------------------------------------
//   Constructor: requires a timer duration, this can always be changed with setTimer()
*********************************************************************************************************************/

class Timer {
    // Store the duration and start the timer
    constructor( _duration , paused) {
      this.startTime = millis();
      this.duration = _duration;
      this.paused = paused;
    }
    
    // just start the timer
    start() { 
      this.startTime = millis();
    }

    pause() {
      this.duration = this.getRemainingTime();
      this.paused = true;
    }

    play() {
      this.paused = false;
      this.startTime = millis();
    }
    
    // set the duration, doesn't restart the timer
    setTimer(_duration) {
      this.duration = _duration;
    }
    
    // returns true if the timer is expired, e.g. if millis() is greater than startTime + duration
    expired() {
      if (this.paused) {
        return false;
      }
      return ((this.startTime + this.duration) < millis());
    }
    
    // returns remaining time in milliseconds, zero if timer is done
    getRemainingTime() {
      if( this.expired() ) {
        return 0;
      } else if (this.paused) {
        return this.duration;
      }
        
        
      return  (this.startTime + this.duration) - millis();
    }  

    // returns remaining time in milliseconds, zero if timer is done
    getRemainingTimeFormatted() {
      var timeRemaining = this.getRemainingTime();
      timeRemaining = Number.parseFloat(timeRemaining/1000).toFixed(2);
      return  timeRemaining.toString();
    }  
  
    // returns remaining % of timer, 0.0 through 1.0
    getPercentageRemaining() {
      if( this.duration === 0 )  // avoid div by zero error
        return 0.0;
  
      if( this.expired() )
       return 0.0;
        
      return this.getRemainingTime()/this.duration;
    }
    
    // returns elapsed % of timer, 0.0 through 1.0
    getPercentageElapsed() {
      if( this.duration === 0 )  // avoid div by zero error
        return 0.0;
  
      if( this.expired() )
       return 1.0;
        
      return 1.0 - (this.getRemainingTime()/this.duration);
    }	 	
  }