const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
const width = 15
let direction = 1
let  invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

function createGrid() {
    // Clear the grid in case it was already populated
    grid.innerHTML = '';

    // Create squares for the grid
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    }

    // Reinitialize the squares array to hold the current grid elements
    squares = Array.from(document.querySelectorAll('.grid div'));
}

/*
function createGrid(){
    for (let i = 0; i < 225; i++) {
        const square = document.createElement('div')
        grid.appendChild(square)
    }
}
*/

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

/*
function draw () {
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
*/

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        // Check if the alien's position is not in the aliensRemoved
        if (!aliensRemoved.includes(alienInvaders[i])) {
            squares[alienInvaders[i]].classList.add('invader'); // This will now work correctly
        }
    }
}

draw()

document.addEventListener('keydown', (e) => {
    moveShooter(e);
    shoot(e);
});

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.remove('invader');
        }
    }
}

squares[currentShooterIndex].classList.add('shooter')

function moveShooter (e){
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex-=1
            break
        case 'ArrowRight' :
            if (currentShooterIndex % width < width -1) currentShooterIndex +=1
            break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    remove();

    // Check for edge conditions and move down
    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width; // Move down
        }
        direction = -1; // Change direction
        goingRight = false;
    } else if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width; // Move down
        }
        direction = 1; // Change direction
        goingRight = true;
    }

    // Move all invaders in the current horizontal direction
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    // Updated collision detection
    if (alienInvaders.includes(currentShooterIndex)) {
        resultsDisplay.innerHTML = 'Game Over!';
        clearInterval(invadersId);
    }

    draw();
}

invadersId = setInterval(moveInvaders, 500)

function shoot (e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width; // Move the laser up
    
        // Check if the laser goes out of bounds (reaches the top)
        if (currentLaserIndex < 0) {
            clearInterval(laserId); // Stop the laser
            return; // Exit the function
        }
    
        squares[currentLaserIndex].classList.add('laser');
    
        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');
    
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);
    
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            document.getElementById('score').innerText = results;

                        // Check for win condition
                        if (aliensRemoved.length === alienInvaders.length) {
                            resultsDisplay.innerHTML = 'You Win!';
                            clearInterval(invadersId);  // Stop the invaders from moving
                        }
        }
    }    
        switch(e.key) {
            case 'ArrowUp':
                laserId = setInterval(moveLaser, 100)
    }
}

// Initialization function
function init() {
    console.log('Game initialized');
    // Reset game state
    currentShooterIndex = 202;
    direction = 1;
    invadersId = null;
    goingRight = true;
    aliensRemoved = [];
    results = 0;

    // Create the grid and draw the initial state
    createGrid();
    draw();

    // Set up event listeners
    document.addEventListener('keydown', (e) => {
        moveShooter(e);
        shoot(e);
    });

    // Start the invaders movement
    invadersId = setInterval(moveInvaders, 500);
}

// 6. Start the game
init();