{
    init: (elevators, floors) => {

        console.clear(); // Get rid of the clutter!
        // Let's look at the objects we're working with
        console.log(elevators);
        console.log(floors);

        const elevator = elevators[0]; // Let's use the first elevator
        
        elevator.on("floor_button_pressed", (floorNum) => {
            // Go to floor when floor button pressed
            elevator.goToFloor(floorNum);
        });
        
        elevator.on("passing_floor", (floorNum, direction) => {
            // pick people up if passing in the right direction
            // console.log(floors[floorNum].buttonStates);
            if (direction === "up" && floors[floorNum].buttonStates.up === "activated") {
                
                elevator.goToFloor(floorNum, true); // Do it before anything else
                console.log(`stopping at passing floor ${floorNum} heading ${direction}`);
                
                // Send elevator if someone requests to go up
                // This probably isn't the best place to do this...
                floors.forEach(floor => floor.on("up_button_pressed", () => elevator.goToFloor(floor.level)));
            }
            if (direction === "down" && floors[floorNum].buttonStates.down === "activated") {
                
                elevator.goToFloor(floorNum, true) 
                console.log(`stopping at passing floor ${floorNum} heading ${direction}`)
                
                // Send elevator if someone requests to go down
                floors.forEach(floor => floor.on("down_button_pressed", () => elevator.goToFloor(floor.level)));
            }
        });


        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", () => {
            // Return to the lobby
            elevator.goToFloor(0)
        });             
    },
    update: (dt, elevators, floors) => {
            // We normally don't need to do anything here
        }
}