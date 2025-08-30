// Load score from localStorage (persistent browser storage), or initialize to zeros if none found.
let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

// Immediately update the score on the page.
updateScoreElement();

/*
 Alternative way (commented out) to initialize score if it didn’t exist.
 Already redundant due to the `|| { ... }` above.
if (!score) {
  score = {
    wins: 0,
    losses: 0,
    ties: 0
  };
}
*/

// Tracks whether auto-play is running.
let isAutoPlaying = false;

// Stores the setInterval ID, so we can stop it later.
let intervalId;

// Function to toggle auto-play on/off.
function autoPlay() { 
  if (!isAutoPlaying) {
    // Start a loop every 1 second.
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove(); // pick random move for player
      playGame(playerMove);                  // play a round vs computer
    }, 1000);

    isAutoPlaying = true;

    // Update button text to show current state.
    document.querySelector('.js-auto-play-button')
      .innerHTML = 'Stop Playing';

  } else {
    // Stop the interval if it’s running.
    clearInterval(intervalId);
    isAutoPlaying = false;

    // Reset button text back to default.
    document.querySelector('.js-auto-play-button')
      .innerHTML = 'Auto Play';
  }
}

// Attach click handler to "Auto Play" button.
document.querySelector('.js-auto-play-button')
  .addEventListener('click', () => {
    autoPlay();
  });

// Attach click handlers for manual choice buttons.
document.querySelector('.js-rock-button')
  .addEventListener('click', () => {
    playGame('rock');
  });

document.querySelector('.js-paper-button')
  .addEventListener('click', () => {
    playGame('paper');
  });

document.querySelector('.js-scissors-button')
  .addEventListener('click', () => {
    playGame('scissors');
  });

// Keyboard shortcuts for moves, auto-play, and reset.
document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r') {
    playGame('rock');
  } else if (event.key === 'p') {
    playGame('paper');
  } else if (event.key === 's') {
    playGame('scissors');
  } else if (event.key === 'a') {
    autoPlay();
  } else if (event.key === 'Backspace') {
    // Instead of instantly resetting, show confirmation dialog.
    showResetConfirmation();
  }
});

// Core game function: play a round with player’s chosen move.
function playGame(playerMove) {
  // Computer randomly chooses its move.
  const computerMove = pickComputerMove();

  let result = '';

  // Compare playerMove vs computerMove.
  if (playerMove === 'scissors') {
    if (computerMove === 'rock') {
      result = 'You lose.';
    } else if (computerMove === 'paper') {
      result = 'You win.';
    } else if (computerMove === 'scissors') {
      result = 'Tie.';
    }

  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') {
      result = 'You win.';
    } else if (computerMove === 'paper') {
      result = 'Tie.';
    } else if (computerMove === 'scissors') {
      result = 'You lose.';
    }
    
  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') {
      result = 'Tie.';
    } else if (computerMove === 'paper') {
      result = 'You lose.';
    } else if (computerMove === 'scissors') {
      result = 'You win.';
    }
  }

  // Update score counters based on result.
  if (result === 'You win.') {
    score.wins += 1;
  } else if (result === 'You lose.') {
    score.losses += 1;
  } else if (result === 'Tie.') {
    score.ties += 1;
  }

  // Save updated score back to localStorage.
  localStorage.setItem('score', JSON.stringify(score));

  // Refresh score display.
  updateScoreElement();

  // Show round result text.
  document.querySelector('.js-result').innerHTML = result;

  // Show chosen moves as emoji images.
  document.querySelector('.js-moves').innerHTML = `You
    <img src="images/${playerMove}-emoji.png" class="move-icon">
    <img src="images/${computerMove}-emoji.png" class="move-icon">
    Computer`;
}

// Update the score section in the UI.
function updateScoreElement() {
  document.querySelector('.js-score')
    .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

// Randomly select computer move with equal probability.
function pickComputerMove() {
  const randomNumber = Math.random(); // between 0 and 1
  let computerMove = '';

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = 'rock';
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = 'paper';
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = 'scissors';
  }

  return computerMove;
}

// Reset the score back to zero and clear it from localStorage.
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
}

// Clicking the reset button shows a confirmation first.
document.querySelector('.js-reset-score-button')
  .addEventListener('click', () => {
    showResetConfirmation();
  });

// Ask user to confirm reset.
function showResetConfirmation() {
  document.querySelector('.js-reset-confirmation')
    .innerHTML = `
      Are you sure you want to reset the score?
      <button class="js-reset-confirm-yes reset-confirm-button">
        Yes
      </button>
      <button class="js-reset-confirm-no reset-confirm-button">
        No
      </button>
    `;
  
  // If yes → reset score and hide prompt.
  document.querySelector('.js-reset-confirm-yes')
    .addEventListener('click', () => {
      resetScore();
      hideResetConfirmation();
    });
  
  // If no → just close the prompt.
  document.querySelector('.js-reset-confirm-no')
    .addEventListener('click', () => {
      hideResetConfirmation();
    });
}

// Clears the confirmation dialog.
function hideResetConfirmation() {
  document.querySelector('.js-reset-confirmation')
    .innerHTML = '';
}