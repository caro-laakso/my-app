import {useState} from 'react';

// Square component represents a single square in the game board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component represents the game board and handles square clicks
function Board({ xIsNext, squares, onPlay }) {
  // handleClick function is called when a square is clicked, updating the game state
  function handleClick(i) {
    // Check if there is already a winner or if the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Create a copy of the current squares array to modify
    const nextSquares = squares.slice();
    // Set the value of the clicked square based on the current player
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    // Call the onPlay function to update the game state
    onPlay(nextSquares);
  }

  // Determine the winner and update the game status
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Render the game board and status
  return (
    <>
      {/* Display the game status */}
      <div className="status">{status}</div>
      {/* Render the game board rows and squares */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Game component represents the overall game, managing history and moves
export default function Game() {
  // State for game history and current move
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  // Handle the play and update the game history
  function handlePlay(nextSquares) {
    // Create a new history array by appending the modified squares array
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    // Set the current move to the last index of the updated history
    setCurrentMove(nextHistory.length - 1);
  }

  // Jump to a specific move in the game history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Map over the game history to generate a list of moves
  const moves = history.map((squares, move) => {
    let description;
    // Set the move description based on the move number
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    // Render a button for each move that allows jumping to that move
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render the overall game component
  return (
    <div className="game">
      <div className="game-board">
        {/* Render the Board component with current game state */}
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {/* Render the list of moves */}
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// calculateWinner function determines if there is a winner in the game
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check for a winning combination
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  // If no winner, return null
  return null;
}
