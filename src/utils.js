const WIDTH = 5;
const HEIGHT = 3;
const SQUARE_HEIGHT = HEIGHT * 2 - 1;
const PLAYER_1 = "A";
const PLAYER_2 = "B";

// place a random line blindly.
function takeRandomTurn(board) {
  const y = Math.floor(Math.random() * SQUARE_HEIGHT);
  let maxWidth;
  const isHorizontalRow = y % 2 === 0;
  if (isHorizontalRow) {
    maxWidth = WIDTH - 1;
  } else {
    maxWidth = WIDTH;
  }
  const x = Math.floor(Math.random() * maxWidth);

  if (!board[x][y]) {
    const neighboursEdgeCounts = countNeighbouringEdges(x, y, board);

    // only if this will not complete a square
    if (
      neighboursEdgeCounts.every(
        (numOfNeighbours) =>
          numOfNeighbours === -1 ||
          (numOfNeighbours >= 0 && numOfNeighbours <= 1)
      )
    ) {
      board[x][y] = true;
    }
  }
}

// Find the best possible move by evaluating all possible moves
// down to the end of the game for eac choice
function minimax(
  currentDepth,
  gameState,
  alpha,
  beta,
  isMaximizingTurn,
  bestMoveTree
) {
  // get all possible moves
  const moves = getAvailableMoves(gameState.board);

  // if there is only one choice, this is the end of this branch
  if (moves.length === 1) {
    const { newGameState } = makeMove(
      moves[0].x,
      moves[0].y,
      isMaximizingTurn ? PLAYER_1 : PLAYER_2,
      gameState,
      currentDepth
    );

    bestMoveTree.children.push({
      isBest: true,
      move: moves[0],
      gameState: newGameState,
      children: [],
    });

    const result = {
      x: moves[0].x,
      y: moves[0].y,
      score: computeScore(newGameState.claimed),
    };
    // console.log("minimax base:", currentDepth, result);
    return result;
  }

  let bestScore = isMaximizingTurn
    ? Number.MIN_SAFE_INTEGER
    : Number.MAX_SAFE_INTEGER;
  let bestMove;
  let bestMoveIndex;
  let didCompleteSquare;

  // for each possible move recursively explore each branch
  // using the minimax algorithm
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const { newGameState, completedSquare } = makeMove(
      move.x,
      move.y,
      isMaximizingTurn ? PLAYER_1 : PLAYER_2,
      gameState,
      currentDepth
    );

    bestMoveTree.children.push({
      isBest: false,
      move: move,
      gameState: newGameState,
      children: [],
    });

    const result = minimax(
      currentDepth + 1,
      newGameState,
      alpha,
      beta,
      // if a square was completed, take another turn in a row,
      // otherwise it is the other players turn
      completedSquare ? isMaximizingTurn : !isMaximizingTurn,
      bestMoveTree.children[i]
    );

    if (
      isMaximizingTurn ? result.score > bestScore : result.score < bestScore
    ) {
      bestMove = move;
      bestScore = result.score;
      bestMoveIndex = i;
      didCompleteSquare = completedSquare;
    }
    if (isMaximizingTurn) {
      alpha = Math.max(alpha, bestScore);
    } else {
      beta = Math.min(beta, bestScore);
    }
    if (alpha >= beta) {
      break;
    }
  }

  bestMoveTree.children[bestMoveIndex].isBest = true;
  const result = { x: bestMove.x, y: bestMove.y, score: bestScore };
  // console.log(
  //   `minmax ${
  //     isMaximizingTurn ? "max" : "min"
  //   }: ${currentDepth}, ${JSON.stringify(result)}, ${didCompleteSquare}`
  // );
  return result;
}

// return a new game state with the given move added
function makeMove(x, y, player, gameState, currentDepth) {
  // console.log(`move(${currentDepth})`, x, y, player);
  const newGameState = JSON.parse(JSON.stringify(gameState));
  const neighbours = countNeighbouringEdges(x, y, newGameState.board);
  let completedSquare = false;
  neighbours.forEach((n, index) => {
    if (n === 3) {
      const coords = getSquareCoords(x, y, y % 2 === 0, index === 0);
      newGameState.claimed[coords.x][coords.y] = player;
      completedSquare = true;
    }
  });
  newGameState.board[x][y] = true;
  // printBoard(newGameState.board, newGameState.claimed);
  return { newGameState, completedSquare };
}

function getAvailableMoves(board) {
  const moves = [];
  for (let y = 0; y < board[0].length; y++) {
    const maxLength = y % 2 === 0 ? board.length - 1 : board.length;
    for (let x = 0; x < maxLength; x++) {
      if (!board[x][y]) {
        moves.push({ x, y });
      }
    }
  }
  return moves;
}

function getYSquareCoordinate(y) {
  return Math.floor(y / 2);
}

function getSquareCoords(x, y, isHorizontalRow, isFirst) {
  const ySquareCoordinate = getYSquareCoordinate(y);
  if (isHorizontalRow) {
    if (isFirst) {
      return { x: x, y: ySquareCoordinate - 1 };
    } else {
      return { x: x, y: ySquareCoordinate };
    }
  } else {
    if (isFirst) {
      return { x: x - 1, y: ySquareCoordinate };
    } else {
      return { x: x, y: ySquareCoordinate };
    }
  }
}

function countNeighbouringEdges(x, y, board) {
  const isHorizontalRow = y % 2 === 0;
  if (isHorizontalRow) {
    // complete square above
    let aboveCount = 0;
    if (y >= 2) {
      if (board[x][y - 1]) {
        aboveCount++;
      }
      if (board[x + 1][y - 1]) {
        aboveCount++;
      }
      if (board[x][y - 2]) {
        aboveCount++;
      }
    } else {
      aboveCount = -1;
    }

    // complete square below
    let belowCount = 0;

    if (y < board[x].length - 1) {
      if (board[x][y + 1]) {
        belowCount++;
      }

      if (board[x + 1][y + 1]) {
        belowCount++;
      }

      if (board[x][y + 2]) {
        belowCount++;
      }
    } else {
      belowCount = -1;
    }
    return [aboveCount, belowCount];
  } else {
    // completes square to the left
    let leftCount = 0;
    if (x > 0 && y < board[x].length) {
      if (board[x - 1][y]) {
        leftCount++;
      }
      if (board[x - 1][y - 1]) {
        leftCount++;
      }
      if (board[x - 1][y + 1]) {
        leftCount++;
      }
    } else {
      leftCount = -1;
    }

    // completes square to the right
    let rightCount = 0;
    if (x < board.length - 1 && y < board[x].length) {
      if (board[x][y - 1]) {
        rightCount++;
      }
      if (board[x][y + 1]) {
        rightCount++;
      }
      if (board[x + 1][y]) {
        rightCount++;
      }
    } else {
      rightCount = -1;
    }

    return [leftCount, rightCount];
  }
}

function computeScore(claimed) {
  let score = 0;
  for (let i = 0; i < claimed.length; i++) {
    for (let j = 0; j < claimed[i].length; j++) {
      if (claimed[i][j] === PLAYER_1) {
        score++;
      } else if (claimed[i][j] === PLAYER_2) {
        score--;
      }
    }
  }
  return score;
}

function generateBoardColumn() {
  const arr = new Array(SQUARE_HEIGHT);
  arr.fill(false);
  return arr;
}

function generateBoard() {
  const board = new Array(WIDTH);
  for (let i = 0; i < board.length; i++) {
    board[i] = generateBoardColumn();
  }
  const claimed = new Array(WIDTH - 1);
  for (let i = 0; i < claimed.length; i++) {
    claimed[i] = new Array(SQUARE_HEIGHT);
  }
  return { claimed, board };
}

function printBoard(board, claimed, nextMove) {
  let output = "";
  for (let y = 0; y < SQUARE_HEIGHT; y++) {
    const isHorizontalRow = y % 2 === 0;
    if (isHorizontalRow) {
      for (let x = 0; x < WIDTH - 1; x++) {
        output +=
          "*" +
          (nextMove && nextMove.x === x && nextMove.y === y
            ? "##"
            : board[x][y] == true
            ? "--"
            : "  ");
      }
      output += "*\n";
    } else {
      for (let x = 0; x < WIDTH; x++) {
        output +=
          nextMove && nextMove.x === x && nextMove.y === y
            ? "#"
            : board[x][y]
            ? "|"
            : " ";
        if (x !== WIDTH - 1) {
          const claim = claimed[x][getYSquareCoordinate(y)];
          if (claim === PLAYER_1) {
            output += "AA";
          } else if (claim === PLAYER_2) {
            output += "BB";
          } else {
            output += "  ";
          }
        }
      }
      output += "\n";
    }
  }
  console.log(output);
}

function printBestMoveTree(bestMoveTree) {
  for (let child of bestMoveTree.children) {
    if (child.isBest) {
      printBoard(child.gameState.board, child.gameState.claimed, child.move);
      printBestMoveTree(child);
    }
  }
}

module.exports = {
  takeRandomTurn,
  minimax,
  generateBoard,
  printBoard,
  computeScore,
  countNeighbouringEdges,
  getAvailableMoves,
  getSquareCoords,
  getYSquareCoordinate,
  printBestMoveTree,
};
