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
            };

            const setIndicators = () => {
                // Signal up if elevator direction is up or on floor 0
                if (elevator.destinationDirection() === "up" || elevator.currentFloor() === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                };
                // Signal down if elevator direction is down or on top floor
                if (elevator.destinationDirection() === "down" || elevator.currentFloor() === topFloor) {
                    elevator.goingDownIndicator(true);
                    elevator.goingUpIndicator(false);
                };
            };

            elevator.on("floor_button_pressed", (floorNum) => {
                // Add floor to queue when button pressed
                elevator.goToFloor(floorNum);  
            });

            elevator.on("passing_floor", (floorNum, direction) => {
                // pick people up if passing in the right direction
                // console.log(floors[floorNum].buttonStates);
                // console.log(elevator.loadFactor());

                if (elevator.loadFactor() < .6 ) {
                    if (direction === "up" && floors[floorNum].buttonStates.up === "activated") {
                        elevator.goToFloor(floorNum, true); // Do it before anything else
                        // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                    };

                    if (direction === "down" && floors[floorNum].buttonStates.down === "activated") {
                        elevator.goToFloor(floorNum, true);
                        // console.log(`elevator ${index} stopping at passing floor ${floorNum} heading ${direction}`);
                    };
                };

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
            });            
        });
        
        floors.forEach(floor => {
            // When someone calls an elevetor we will need to decide
            // which elevator to send.
            const chooseElevator = () => {
                // find the distance of each elevator
                // This will return an array of distances 
                // between floor and elevator
                const elevatorDistances = elevators.map(elevator => {
                    return Math.abs(floor.level - elevator.currentFloor());
                });
                
                // Then we just need to get the index of the smallest value
                const closestElevator = elevatorDistances.indexOf(Math.min(...elevatorDistances))
                return closestElevator
                // console.log(`The closest elevator is elevator #${closestElevator}`)
            }
            
            floor.on("up_button_pressed", () => {
                // if the closest elevator is heading up then add this floor to the queue
                elevators[chooseElevator()].destinationDirection === "up" && 
                    elevators[chooseElevator()].goToFloor(floor.level);
            });
            
            floor.on("down_button_pressed", () => {
                // if the closest elevator is heading down then add this floor to the queue
                elevators[chooseElevator()].destinationDirection === "down" && 
                    elevators[chooseElevator()].goToFloor(floor.level);
            });
            // This part definitely needs improvement
        });
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    }
}