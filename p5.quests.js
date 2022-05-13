/***********************************************************************************
  Quest Classes - By Matt Kwong

  Includes the following classes:
  - LoadingScreen
  - Quiz
  - Inventory
  - Storyline
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.avatar.js"></script>
***********************************************************************************/

class LoadingScreen {
    // Animates a Loading screen for transitions in the story

    constructor(loadSpeed) {
        this.stopDegree = 0;
        this.startDegree = 0;
        this.loadingScreenSpeed = loadSpeed;
        this.active = false;
        this.pauseTime = 2;
        this.gameOver = false;
        this.drawEndScreen = false;
    }

    start() {
        this.active = true;
        this.stopDegree = 0;
        this.startDegree = 0;
        this.pauseTime = 2;
    }

    endGame() {
        this.active = true;
        this.stopDegree = 0;
        this.startDegree = 0;
        this.pauseTime = 2;
        this.gameOver = true;
    }

    update() {
        if (this.startDegree >= TWO_PI) {
            // stop drawing
            this.active = false;
        } else if (this.stopDegree < TWO_PI) {
            // beginning: grows the circle
            this.stopDegree += this.loadingScreenSpeed;
        } else if (this.pauseTime > 0) {
            // pauses for a brief moment
            this.pauseTime -= this.loadingScreenSpeed;
            this.drawEndScreen = this.gameOver;
        } else if (!this.gameOver){
            // end: starts shrinking the circle
            this.startDegree += this.loadingScreenSpeed;
        }

        // stops exactly at two_pi
        this.stopDegree = Math.min(TWO_PI, this.stopDegree);
        this.startDegree = Math.min(TWO_PI, this.startDegree);
    }

    draw() {
        this.update();
        if (this.active) {
            push();
            fill(0);
            arc(width/2, height/2, 2000, 2000, this.startDegree - HALF_PI, this.stopDegree - HALF_PI);
            pop();
        }

        if (this.drawEndScreen) {
            console.log("Drawing end screen");
            // draw end screen
            push();
            fill(255);
            textAlign(CENTER);
            textSize(60);
            textFont(titleFont);
            text("The End", width/2, 400);
            textFont(bodyFont);
            textSize(24);
            text("Thanks for playing!", width/2, 425);
            pop();
        }
    }
}

class Quiz {
    constructor() {
        this.quizPrompts = [];
        this.quizChoices = [];
        this.quizAnswers = [];
        this.populateQuiz();

        this.randomQuiz = [];
        this.getRandomNumbers();

        this.score = 0;
        this.index = 0;
        this.completed = false;
        this.passed = false;
    }

    resetQuiz() {
        this.getRandomNumbers();

        this.score = 0;
        this.index = 0;
        this.completed = false;
        this.passed = false;
    }
    
    getRandomNumbers() {
        this.randomQuiz = [];
        let totalQuestions = 4;
        while( totalQuestions >=  0) {
            let randomNum = Math.floor(Math.random() * this.quizPrompts.length);
            if (!this.randomQuiz.includes(randomNum)){
                this.randomQuiz.push(randomNum);
                totalQuestions --;
            }
        }
        console.log(this.randomQuiz);
    }

    populateQuiz() {
        this.quizPrompts = ["How many burgers are eaten every year in the United States?", "Where was the Hamburger invented?", "Sonya Thomas holds the world record for eating a 9 pound burger in how many minutes?", "What percentage of the world’s sandwiches are actually hamburgers?", "During WWII, to avoid using German names, hamburgers were temprarily renamed what?", "What was the diameter of the world’s largest hamburger?", "How many burgers does McDonald’s sell every second?", "In 1921, the first fast food burger was sold for how much?"];
        this.quizChoices[0] = ["50 billion", "100 million", "Surely more than 1?"];
        this.quizAnswers[0] = 0;
        this.quizChoices[1] = ["San Francisco, California", "New Haven, Connecticut", "Fort Worth, Texas"];
        this.quizAnswers[1] = 1;
        this.quizChoices[2] = ["3 minutes", "9 minutes", "12 minutes"];
        this.quizAnswers[2] = 1;
        this.quizChoices[3] = ["45%", "10%", "60%"];
        this.quizAnswers[3] = 2;
        this.quizChoices[4] = ["Liberty Sandwiches", "New Yorker", "Krabby Pattty"];
        this.quizAnswers[4] = 0;
        this.quizChoices[5] = ["1 foot", "5 feet", "10 feet"];
        this.quizAnswers[5] = 2;
        this.quizChoices[6] = ["10", "45", "75"];
        this.quizAnswers[6] = 2
        this.quizChoices[7] = ["1 penny", "1 nickel", "100 dollars"];
        this.quizAnswers[7] = 1;
        console.log("Populated Quiz");
        console.log(this.quizPrompts);
    }

    start() {
        if (this.index >= this.randomQuiz.length) {
            // quiz is done
            this.completed = true;
            this.passed = this.score > 2;
            advanceStory = true;
            return;
        }
        
        // display quiz
        let i = this.randomQuiz[this.index];
        selectTextBox(this.quizPrompts[i], this.quizChoices[i], selectedChoiceIndex, true);

        // if submitted, check if it was correct
        if (submitSelection) {
            if (selectedChoiceIndex === this.quizAnswers[i]) {
                this.score ++;
            }
            this.index ++;
            submitSelection = false;
        }
    }

}

class Inventory {
    constructor() {
        this.flashDrive = new Item(925,760,itemImages[0]);
        this.book = new Item(800,760,itemImages[1]);
        this.resume = new Item(925,760,itemImages[2]);
        this.paperwork = new Item(925,760,itemImages[3]);
    }

    draw() {
        this.flashDrive.draw();
        this.book.draw();
        this.resume.draw();
        this.paperwork.draw();
        if (!currentlyInteracting && !currentlyNarrating && !currentlyTalkingToSon) {
            this.checkHover();
        }
    }

    checkHover() {
        if (this.flashDrive.isHovered) {
            console.log("showing flash drive");
            textBox("A flash drive containing Rosie's resume. Talk to the librarian to get it printed out.", true);
        } else if (this.book.isHovered) {
            if (storyline.storyIndex === 8 && quiz.index < quiz.randomQuiz.length) {
                let currentAnswer = quiz.quizAnswers[quiz.randomQuiz[quiz.index]];
                textBox("The correct answer to this question is: " + quiz.quizChoices[quiz.randomQuiz[quiz.index]][currentAnswer] , false);
            } else {
                textBox("To complete the interview quiz, use the arrow keys to select and answer, and press return to submit. Hover over this book again while you take the quiz!", true);
            }
            console.log("showing book");
            
        } else if (this.resume.isHovered) {
            console.log("showing resume");
            textBox("A copy of Rosie's resume. Give it to the manager so you can interview for the job.", true);
        } else if (this.paperwork.isHovered) {
            console.log("showing paperwork");
            textBox("Signed lease agreement for Rosie's new apartment. Hand it to the Landlord to finish the game.", true);
        }
    }
}

class Storyline {
    constructor() {
        // trackers
        this.storyIndex = 0;
        this.currentDay = 1;
        this.workedToday = false;

        // locks
        this.shelterLocked = true;
        this.managerLocked = true;
        this.restaurantLocked = false;
        this.storeLocked = true;
        this.bedLocked = true;
        this.houseLocked = true;

        // special
        this.displayQuiz = false;
        this.sonDialogue = false;

        // minigame toggles
        this.recordScore = false;
        this.promotionReady = false;
        this.dishMinigame = false;
        this.dishScore = 0;
        this.grillMinigame = false;
        this.grillScore = 0;
        // need to gete 20 points to get promoted
        this.requiredPoints = 15;

        this.currentHint = "";
        // var narrator = new NPC("narrator", -100,-100);
    }

    advanceStory(num) {
        if (this.storyIndex < num) {
            quiz.passed = true;
            advanceStory = true;
        }
    }

    checkForAdvances() {
        if (advanceStory) {
            resetState();

            switch (this.storyIndex) {
                case 0:
                    // Talk to the Librarian and learn about the shelter
                    console.log("unlocked shelter");
                    this.shelterLocked = false;
                    this.currentHint = "Aren't you heading to the Shelter?";
                    break;
                case 1:
                    // Talk to the Volunteer and then start Quest 2
                    this.currentHint = "";
                    console.log("Done with Quest 1");
                    narrator.loadLines(["Narrator: Hey! Its me again, the Narrator. Seems as though you have met our dear friend, Volunteer! Volunteer is an amazing person who can answer any questions you might have throughout the rest of the game.", "Narrator: If you are ever stuck or need help, pay her a visit!", "Narrator: Now you're ready to begin Quest 2! ~ Finding a Job ~"]);
                    librarianIndex = 1;
                    volunteerIndex = 1;
                    questNum = 2;
                    // reload the Shelter and Library page to get new dialogue;
                    adventureManager.reload("Shelter");
                    adventureManager.reload("Library");
                    
                    break;
                case 2:
                    // Talk to Volunteer again and learn about job opportunity, then head to the library 
                    this.currentHint = "Head to the Library!";
                    console.log("Started Quest 2");
                    break;
                case 3:
                    // Talk to the librarian and start mini quest to write resume
                    this.currentHint = "When you have your resume and book ready, come back to me!";
                    console.log("starting mini quest to write resume");
                    break;
                case 4:
                    // Write your resume
                    this.currentHint = "Wait! I think there is one other thing I need to do";
                    console.log("Need to find the book");
                    inventory.flashDrive.inInventory = true;
                    break;
                case 5:
                    // Collect your book
                    this.currentHint = "Wait! I need to talk to the Librarian now";
                    librarianIndex  = 2;
                    adventureManager.reload("Library");
                    console.log("Getting Resume printed and books checked out");
                    inventory.book.inInventory = true;
                    break;
                case 6:
                    // Talk to Librarian again to check book out and print resume
                    this.currentHint = "The restaurant is just on the other side of town. Good luck with the interview!";
                    managerIndex = 1;
                    adventureManager.reload("Restaurant");
                    this.managerLocked = false;
                    console.log("Time for the interview");
                    inventory.flashDrive.inInventory = false;
                    inventory.resume.inInventory = true;
                    break;
                case 7:
                    // Head to restaurant to talk to manager
                    console.log("Starting quiz");
                    inventory.resume.inInventory = false;
                    this.displayQuiz = true;
                    break;
                case 8:
                    // Take the quiz ( this stage repeats until you pass the quiz )
                    this.displayQuiz = false;
                    if (quiz.passed) {
                        this.currentHint = "Manager: Come back later to start your first shift!"
                        console.log("Passed with quiz");
                        managerIndex = 2;
                    } else {
                        console.log("Failed with quiz");
                        // didn't pass, need to redo the quiz
                        quiz.resetQuiz();
                        this.storyIndex -= 2;
                    }
                    adventureManager.reload("Restaurant");
                    break;
                case 9:
                    // Talk to the manager again to accept the job
                    console.log("Got the Job!");
                    this.currentHint = "Rosie: I should tell Volunteer that I got the job!"
                    volunteerIndex ++;
                    adventureManager.reload("Shelter");
                    this.restaurantLocked = true;
                    break;
                case 10:
                    // Talk to the volunteer
                    console.log("Pick up your son");
                    this.currentHint = "Head to the school to pick up your son!";
                    narrator.loadLines(["Narrator: Let me jump in again here to explain what's next. Each day, you can go to work and you have one attempt at a minigame/simulation. If you earn enough points from those games, the manager might (most definitely will) promote you.", "Narrator: Every day you also need to bring your son to school before you go to work, and then pick him up afterwards", "Narrator: Speaking of which, you should probably go and pick him up right now!"]);
                    this.workedToday = true;
                    this.bedLocked = false;

                    sonAvatar.loadLines(["Rosie: Hey kiddo, I got some exciting news! I found a job!", "Son: Really?? Does that mean we can stay at home again?", "Rosie: No not yet. The job I found doesn't pay all that much, so in the meantime we are going to stay at the shelter on the other side of town.", "Son: Oh okay...", "Rosie: Hey, we'll make it through this okay?", "Son: Yeah...", "Rosie: C'mon lets head over to the shelter then."]);
                    this.sonDialogue = true;
                    this.restaurantLocked = true;
                    this.promotionReady = true;
                    // set promotion to true to advance story after you sleep
                    break;
                
                case 11:
                    // First day as a Dish Washer
                    console.log("11: Working as a dish washer");
                    this.currentHint = "Hi how's it going?";
                    this.dishMinigame = true;
                    this.restaurantLocked = false;
                    this.promotionReady = false;

                    break;
                case 12:
                    // Talk to the Manager and get promoted to a Chef 
                    console.log("12: Getting promoted to Chef");
                    this.dishMinigame = false;
                    this.promotionReady = false;
                    this.currentHint = "Rosie: I need to tell my son the good news!";
                    managerIndex ++;
                    adventureManager.reload("Restaurant");
                    
                    break;
                case 13: 
                    console.log("13: Talking to son & going to the store");
                    // Talk to son and then go to bed
                    sonAvatar.loadLines(["Rosie: Guess what?", "Son: What's up", "Rosie: I got promoted to Chef!", "Son: Woaaah! That's cool!!!", "Rosie: I know! To celebrate let's get you some new clothes at Target!", "Son: Really!?!", "Rosie: Of course! I think we've earned it... C'mon let's go!", "Son: Okay!"]);
                    this.sonDialogue = true;
                    this.promotionReady = true;
                    // advance story after you sleep 

                    this.storeLocked = false;
                    // unlock the store to go "shopping"
                    
                    this.grillMinigame = true;
                    this.workedToday = true;
                    break;
                case 14:
                    // First day as a Chef
                    console.log("14: Working as a Chef now");
                    this.currentHint = "Chef Rosie has a nice ring to it!";
                    this.storeLocked = true;
                    this.promotionReady = false;
                    break;
                case 15:
                    // Talk to the Manager to get promoted
                    console.log("15: Getting promoted to Manager");
                    this.currentHint = "Rosie: I should tell Volunteer about this promotion! Maybe we can start looking for places now.";
                    this.grillMinigame = false;
                    this.promotionReady = false;
                    this.bedLocked = true;

                    managerIndex ++;
                    adventureManager.reload("Restaurant");

                    break;
                case 16:
                    // Share news with son and Volunteer
                    this.currentHint = "";
                    console.log("16: Talking with son")
                    sonAvatar.loadLines(["Rosie: I have some good news today!", "Son: What happened?", "Rosie: I got promoted again! I'm the Manager now!", "Son: Really!?! Does that mean ..?", "Rosie: We'll see! Let's head over to the shelter to talk to Volunteer again.", "Son: Okay!"]);
                    this.sonDialogue = true;
                    
                    // Talk to the Volunteer to get the paperwork to your new apartment
                    volunteerIndex ++;
                    adventureManager.reload("Shelter");
                    this.grillMinigame = false;
                    this.restaurantLocked = true;
                    this.workedToday = true;
                    break;
                case 17:
                    // Final scene : Enter the house and ROLL CREDITS
                    console.log("-- Final Scene --");
                    inventory.paperwork.inInventory = true;
                    this.houseLocked = false;

                default:
                    console.log("Error: no more story advances | questnum: " + questNum + " storyIndex: " + this.storyIndex);
            }
            this.storyIndex++;
            advanceStory = false;
        }
    }


    // When the player interacts with the bed, check progress and then reset the day
    checkDayCycle() {
        if (dayComplete) {
            console.log("Day Completed... sleeping");
            this.currentDay ++;
            // Animate loading screen
            loadingScreen.start();
            narrator.loadLines([this.getDailyStatusUpdate()]);

            if(this.promotionReady) {
                console.log("advancing story");
                advanceStory = true;
                this.promotionReady = false;
            }

            this.workedToday = false;
            this.restaurantLocked = false;
            dayComplete = false;
            resetState();

            if (this.dishMinigame) {
                adventureManager.reload("DishMinigame");
            } else if (this.grillMinigame) {
                adventureManager.reload("GrillMinigame");
            }
        }
    }

    getDailyStatusUpdate() {
        let pointsNeeded = this.requiredPoints - this.dishScore;
        if (this.grillMinigame) {
            pointsNeeded = this.requiredPoints - this.grillScore;
        }

        let currentDay = "Good Morning! Today is day " + this.currentDay + ", and you currently need " + pointsNeeded + " more points until your next promotion.";
        if (pointsNeeded <= 0) {
            this.promotionReady = true;
            currentDay = "Good Morning! Today is day " + this.currentDay + ", and it look's like you might be due for a promotion! Go talk to the manager today after you drop off your son.";
        }
        
        return currentDay;
    }

    completedDailyTasks() {
        return this.workedToday && !sonAvatar.atSchool && !this.bedLocked;
    }
}
  