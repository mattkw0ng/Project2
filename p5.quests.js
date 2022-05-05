/* =============================== QUEST CLASSES =============================== */

class Quest {
    constructor(title, hint) {
        this.title = title;
        this.hint = hint;
        this.completed = false;
    }

    showHint() {
        // display text
        console.log(hint);
    }

    checkStatus() {
        // check if done
        return false;
    }

    printMessage(msg) {
        // print error message
        console.log(msg);
    }
}
  
class Quest1 extends Quest{
    // find shelter (go to library for more information)
    constructor(title, hint) {
        super(title, hint);
        this.visitedLibrary = false;
        this.talkedToLibrarian = false;
        this.visitedShelter = false;
        this.talkedToVolunteer = false;

    }

    checkStatus() {
        if (adventureManager.getStateName === "Library") {
        this.visitedLibrary = true;
        }

        if (adventureManager.getStateName === "Shelter") {
        if (this.talkedToLibrarian) {
            this.visitedShelter = true;
            this.completed = true;
        } else {
            super.printMessage("Talk to the librarian first!");
        }
        } 

        return this.completed;
    }
}

class Quest2 extends Quest{
    // second quest: get a job (write and print resume at library, also research/interview prep -> interview for the job)
    constructor(title, hint) {
        super(title, hint);
        this.writeResume = false;
        this.printResume = false;
        this.interviewPrep = false;
    }

    checkStatus() {
        if (this.interviewPrep && this.printResume) {
        this.completed = true;
        }
        return this.completed;
    }

    tryPrinting() {
        if (this.writeResume) {
        this.printResume = true;
        } else {
        super.printMessage("Write your resume first!");
        }
        return this.printResume;
    }
}

class Quest3 extends Quest{
    // third quest: become a chef/manager (score a certain amount of points)
    constructor(title, hint) {
        super(title, hint);
        this.totalScore = 0;
    }

    checkStatus() {
        if (this.totalScore >= 100) {
        this.completed = true;
        }
        return this.completed;
    }

    updateScore(num) {
        this.totalScore += num;
    }
    }

    class Quest4 extends Quest{
    // fifth quest: buy apartment (visit residential area)
    constructor(title, hint) {
        super(title, hint);
        this.totalScore = 0;
    }

    checkStatus() {
        if (this.totalScore >= 100) {
        this.completed = true;
        }
        return this.completed;
    }

    updateScore(num) {
        this.totalScore += num;
    }
}

class Storyline {
    constructor() {
        this.storyIndex = 0;
        this.shelterLocked = true;
        this.currentHint = "";
        // var narrator = new NPC("narrator", -100,-100);
    }

    checkForAdvances() {
        if (advanceStory === true) {
            resetState();

            switch (this.storyIndex) {
                case 0:
                    console.log("unlocked shelter");
                    this.shelterLocked = false;
                    this.currentHint = "Aren't you heading to the Shelter?";
                    break;
                case 1:
                    this.currentHint = "";
                    console.log("Done with Quest 1");
                    // narrator.addSingleInteraction("Hey! Its me again, the Narrator. Seems as though you have met our dear friend, Volunteer! Volunteer is an amazing person who can answer any questions you might have throughout the rest of the game. If you are ever stuck or need help, pay her a visit!");
                    // narrator.displayInteractions(playerAvatar);

                    questNum++;
                    // reload the Shelter and Library page to get new dialogue;
                    adventureManager.reload("Shelter");
                    adventureManager.reload("Library");
                    
                    break;
                case 2:
                    this.currentHint = "Head to the Library!";
                    console.log("Started Quest 2");
                    break;
                case 3:
                    this.currentHint = "When you have your resume and book ready, come back to me!";
                    console.log("starting mini quest to write resume and find a book");
                    break;
                case 4:
                    this.currentHint = "Wait! I think there is one other thing I need to do";
                    console.log("completed either resume or found book");
                    break;
                case 5:
                    this.currentHint = "The restaurant is just on the other side of town. Good luck with the interview!";
                    questNum++;
                    adventureManager.reload("Library");
                    console.log("ready to go to manager!");
                    break;
                default:
                    console.log("no more story advances | questnum: " + questNum + " storyIndex: " + this.storyIndex);
            }
            this.storyIndex++;
            advanceStory = false;
        }
    }
}
  