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
                
                console.log(`elevator ${index} queue: ${elevator.destinationQueue}`);
            }

            elevator.on("floor_button_pressed", (floorNum) => {
                // Go to floor when floor button pressed
                elevator.goToFloor(floorNum);      
            });

            elevator.on("passing_floor", (floorNum, direction) => {
                // pick people up if passing in the right direction
                // console.log(floors[floorNum].buttonStates);
                // console.log(elevator.loadFactor()); // load factor doesn't seem to be a problem yet.
                
                if (direction === "up" && floors[floorNum].buttonStates.up === "activated") {
                    elevator.goToFloor(floorNum, true); // Do it before anything else
                    // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                }
                
                if (direction === "down" && floors[floorNum].buttonStates.down === "activated") {
                    elevator.goToFloor(floorNum, true);
                    // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                }
                
                updateDestinationQueue();
                // Calling this here should keep the queue updated
            });

            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", () => {
                // Split elevators between lobby and topFloor
                index % 2 === 0 ? elevator.goToFloor(0) : elevator.goToFloor(topFloor);
            });  

            floors.forEach(floor => {
                floor.on("up_button_pressed", () => {
                    // Add to the queue if the elevator is heading in that direction
                    elevator.destinationDirection() === "up" && elevator.goToFloor(floor.level); 
                          
                    // console.log(`floor ${floor.level} has requested an elevator heading up`);
                });
                floor.on("down_button_pressed", () => {
                    elevator.destinationDirection() === "down" && elevator.goToFloor(floor.level); 
                    
                    // console.log(`floor ${floor.level} has requested an elevator heading down`);
                });
            });
        });   
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    }
}