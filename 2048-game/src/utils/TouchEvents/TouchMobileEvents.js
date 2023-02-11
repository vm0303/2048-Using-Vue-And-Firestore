export class TouchMobileEvents {

    constructor(targetNode) {
        this.target = targetNode;
        this.distance = 25;
        this.dispatched = false;
        this.startPoint = {x: 0, y: 0};
        this.initListeners();
    }

    initListeners() {
        this.target.addEventListener("touchstart", (e) => this.handleStart(e));
        this.target.addEventListener("touchmove", (e) => this.handleMove(e));
        this.target.addEventListener("touchend", () => (this.dispatched = false));
    }

    dispatchEvent(direction) {
        const event = new CustomEvent("custom:swipe", {detail: {direction}});
        this.target.dispatchEvent(event);
        this.dispatched = true;
    }

    handleStart(e) {
        this.startPoint.x = e.touches[0].clientX;
        this.startPoint.y = e.touches[0].clientY;
    }

    handleMove(e) {
        if (this.dispatched) return;
        const {clientX: x, clientY: y} = e.touches[0];
        const xDist = x - this.startPoint.x;
        const yDist = y - this.startPoint.y;

        if (Math.abs(xDist) > Math.abs(yDist)) {
            this.compareAndDispatch(xDist, "right", "left");
        } else {
            this.compareAndDispatch(yDist, "down", "up");
        }
    }

    compareAndDispatch(dist, forth, back) {
        if (dist > this.distance) {
            this.dispatchEvent(forth);
        } else if (-dist > this.distance) {
            this.dispatchEvent(back);
        }
    }
}
