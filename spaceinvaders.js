const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let  invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw () {
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

draw()

function remove () {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

// squares[currentShooterIndex].classList.add('shooter')

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
document.addEventListener('keydown', moveShooter)

function moveInvaders () {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'Game Over!'
        clearInterval(invadersId)

    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if(alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = 'Game Over!'
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'You Win!'
        clearInterval(invadersId)
    }
}
invadersId = setInterval(moveInvaders, 500)

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        // Remove the previous laser position
        squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width; // Move the laser up

        // Check if the laser is out of bounds (above the grid)
        if (currentLaserIndex < 0) {
            clearInterval(laserId); // Stop the laser if it goes out of bounds
            return; // Exit the function to prevent errors
        }

        // Add the new laser position
        squares[currentLaserIndex].classList.add('laser');

        // Check if the laser hits an invader
        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            if (alienRemoved !== -1) {
                aliensRemoved.push(alienRemoved);
                results++;
                resultsDisplay.innerHTML = results;

                // Check if all aliens are removed (win condition)
                if (aliensRemoved.length === alienInvaders.length) {
                    resultsDisplay.innerHTML = 'You Win!';
                    clearInterval(invadersId); // Stop the game if all aliens are destroyed
                }
            }
        }
    }

    // Trigger the laser movement on arrow up press
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100);
            break;
    }
}

document.addEventListener('keydown', shoot)

//Function to refresh the page
function refreshPage() {
    location.reload(); // Reloads the page
}