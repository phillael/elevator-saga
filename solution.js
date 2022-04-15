{
    init: (elevators, floors) => {
        // ULTIMATE PARTY MODE!!!
        challenges.forEach(challenge => {
            challenge.options.elevatorCount = challenge.options.floorCount;
            challenge.options.spawnRate = 100;
            challenge.options.elevatorCapacities = [15];
        });
        
        elevators.forEach((elevator, index) => { 
            elevator.on("idle", () => elevator.goToFloor(index));
            elevator.on("floor_button_pressed", (floorNum) => elevator.goToFloor(floorNum));
        });
    },
    update: (dt, elevators, floors) => {
        
        const elevatorElems = document.getElementsByClassName('elevator');
        const users = document.getElementsByClassName('user');      
        
        const randomColor = () => {
            const r = Math.random() * 255;
            const g = Math.random() * 255;
            const b = Math.random() * 255; 
            
            return `rgb(${r}, ${g}, ${b}`;
        };
            
        for (let el of elevatorElems) {               
            el.style.backgroundColor = randomColor();       
        };      
            
        for (let u of users) {                
            u.style.color = randomColor();
        };
    }
}