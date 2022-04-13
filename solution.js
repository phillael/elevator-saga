{
    init: (elevators, floors) => {
        
        console.clear(); // Get rid of the clutter!
        // Let's look at the objects we're working with
        console.log(elevators);
        console.log(floors);
        
        const elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", () => {
            // let's go to all the floors
            floors.forEach(floor => elevator.goToFloor(floor.level));
        });
    },
    update: (dt, elevators, floors) => {
        // We normally don't need to do anything here
    }
}