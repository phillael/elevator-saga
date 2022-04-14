{
    init: function(elevators, floors) {

        // Let's eliminate all the stress
        // and just move 1 person every 60 seconds
        challenges.forEach(challenge => {
            challenge.condition = requireUserCountWithinTime(1, 60)
        })

        elevators.forEach(elevator => {
            elevator.on('floor_button_pressed', (floorNum) => {
                elevator.goToFloor(floorNum)
            })
        })      
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}