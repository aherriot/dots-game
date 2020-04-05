const {
  takeRandomTurn,
  minimax,
  generateBoard,
  printBoard,
  printBestMoveTree,
} = require("./utils");

// This program uses the minimax optimization algorithm with alpha-beta pruning
// to determine the best move to make in the classic dots and lines game
// normally played by bored children.

function main() {
  // create data structures to represent game state
  const { board, claimed } = generateBoard();

  printBoard(board, claimed);

  // take some random moves to fill up the board
  // but don't complete any squares yet
  for (let i = 0; i < 60; i++) {
    takeRandomTurn(board, claimed);
  }

  // keep history of possible moves
  // so that we can trace through the optimal branch
  // when we find the best path to take.
  const bestMoveTree = {
    isBest: true,
    gameState: { board, claimed },
    children: [],
  };

  // Recursively run the minimax algorithm with alpha-beta pruning
  // to determine the best move to play.
  const result = minimax(
    0,
    { board, claimed },
    Number.MIN_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    true,
    bestMoveTree
  );

  // print results
  printBoard(board, claimed, result);
  console.log("best move: ", result);
  printBestMoveTree(bestMoveTree);
}

main();
