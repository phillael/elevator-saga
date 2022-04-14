{
    init: (elevators, floors) => {

        console.clear(); // Get rid of the clutter!
        // Let's look at the objects we're working with
        console.log(elevators);
        console.log(floors);
        
        const topFloor = floors.length - 1;

        elevators.forEach((elevator, index) => {
            
            const updateDestinationQueue = () => {
                // The destinationQueue gets polluted with many copies of the same floor request.
                // This is an attempt ensure there is only 1 request per floor in the queue.
                // Here is a cool way to get a new array with the unique values!
                
                elevator.destinationQueue = [...new Set(elevator.destinationQueue)];
                elevator.checkDestinationQueue();
                // Note that you need to call checkDestinationQueue() for the change to take effect immediately.
                
                // console.log(`elevator ${index} queue: ${elevator.destinationQueue}`);
            }
            
            const setIndicators = () => {
                
                if (elevator.destinationDirection() === "up" || elevator.currentFloor() === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                }
                if (elevator.destinationDirection() === "down" || elevator.currentFloor() === topFloor) {
                    elevator.goingDownIndicator(true);
                    elevator.goingUpIndicator(false);
                }
            }

            elevator.on("floor_button_pressed", (floorNum) => {
                // Go to floor when floor button pressed
                elevator.goToFloor(floorNum);  
            });

            elevator.on("passing_floor", (floorNum, direction) => {
                // pick people up if passing in the right direction
                // console.log(floors[floorNum].buttonStates);
                // console.log(elevator.loadFactor()); // load factor doesn't seem to be a problem yet.
                
                if (elevator.loadFactor() < .6 ) {
                    if (direction === "up" && floors[floorNum].buttonStates.up === "activated") {
                        elevator.goToFloor(floorNum, true); // Do it before anything else
                        // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                    }

                    if (direction === "down" && floors[floorNum].buttonStates.down === "activated") {
                        elevator.goToFloor(floorNum, true);
                        // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                    }
                }
                
                setIndicators();
                updateDestinationQueue();
            });

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", () => {   
                elevator.goToFloor(0);
                // this seems to work better than spliting between floors
            });
            
            elevator.on("stopped_at_floor", function(floorNum) {
                setIndicators();
            })            
        });         
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    }
}