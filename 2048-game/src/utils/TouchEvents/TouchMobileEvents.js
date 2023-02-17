
//This file handles the swiping functions for the board
export class TouchMobileEvents {

    // The constructor determines if a finger is swiped
    constructor(theTiles)
    {

        this.objective = theTiles;
        this.deployed = false;
        this.touchHasStarted = {x: 0, y: 0};
        this.initListeners();
    }

    initListeners()
    {
        this.objective.addEventListener("touchstart", (e) => this.handleTouchStart(e));
        this.objective.addEventListener("touchmove", (e) => this.handleTouchMove(e));
        this.objective.addEventListener("touchend", () => (this.deployed = false));
    }


    dispatchEvent(direction)
    {
        const event = new CustomEvent("custom:swipe", {detail: {direction}});
        this.objective.dispatchEvent(event);
        this.deployed = true;
    }

    handleTouchStart(e) {
        e.preventDefault();
        this.touchHasStarted.x = e.touches[0].clientX;
        this.touchHasStarted.y = e.touches[0].clientY;
    }

    handleTouchMove(e) {

        if (this.deployed) return;
        const {clientX: x, clientY: y} = e.changedTouches[0];
        const xDist = x - this.touchHasStarted.x;
        const yDist = y - this.touchHasStarted.y;

      if (Math.abs(xDist) > Math.abs(yDist))
      {
            this.analyzeAndDeploy(xDist, "right", "left");

      } if (Math.abs(xDist) < Math.abs(yDist)){

              this.analyzeAndDeploy(yDist, "down", "up");


        }
    }

    analyzeAndDeploy(dist, forth, back)
    {
        if (dist > 25) {
            this.dispatchEvent(forth);

        }

        else if (-dist > 25) {
            this.dispatchEvent(back);

        }
    }

}
