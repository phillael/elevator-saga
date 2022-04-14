{
    init: (elevators, floors) => {

        console.clear(); // Get rid of the clutter!
        // Let's look at the objects we're working with
        console.log(elevators);
        console.log(floors);

        const elevator = elevators[0]; // Let's use the first elevator

        const updateDestinationQueue = () => {
            // The destinationQueue gets polluted with many copies of the same floor request
            // This is an attempt ensure there is only 1 request per floor in the queue
            
            // Here is a cool way to get a new array with the unique values!
            elevator.destinationQueue = [...new Set(elevator.destinationQueue)];
            
            // Note that you need to call checkDestinationQueue() for the change to take effect immediately.
            elevator.checkDestinationQueue();
            // console.log(elevator.destinationQueue);
        }

        elevator.on("floor_button_pressed", (floorNum) => {
            // Go to floor when floor button pressed
            elevator.goToFloor(floorNum);
            updateDestinationQueue();         
        });

        elevator.on("passing_floor", (floorNum, direction) => {
            // pick people up if passing in the right direction
            // console.log(floors[floorNum].buttonStates);

            if (direction === "up" && floors[floorNum].buttonStates.up === "activated") {

                elevator.goToFloor(floorNum, true); // Do it before anything else
                // console.log(`stopping at passing floor ${floorNum} heading ${direction}`);
            }
            if (direction === "down" && floors[floorNum].buttonStates.down === "activated") {

                elevator.goToFloor(floorNum, true);
                // console.log(`stopping at passing floor ${floorNum} heading ${direction}`);
            }
        });

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", () => {
            // Return to the lobby
            elevator.goToFloor(0);            
        });  

        floors.forEach(floor => {
            floor.on("up_button_pressed", () => {
                elevator.goToFloor(floor.level);
                //console.log(`floor ${floor.level} has requested an elevator heading up`);
                updateDestinationQueue();

            });
            floor.on("down_button_pressed", () => {
                elevator.goToFloor(floor.level);
                //console.log(`floor ${floor.level} has requested an elevator heading down`);
                updateDestinationQueue();
            });
        });
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    }
}