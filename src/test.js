const {
  computeScore,
  countNeighbouringEdges,
  getFreeMoves,
  getSquareCoords,
  getYSquareCoordinate
} = require("./utils");

test("getYSquareCoordinate", () => {
  expect(getYSquareCoordinate(0)).toEqual(0);
  expect(getYSquareCoordinate(1)).toEqual(0);
  expect(getYSquareCoordinate(2)).toEqual(1);
  expect(getYSquareCoordinate(3)).toEqual(1);
  expect(getYSquareCoordinate(4)).toEqual(2);
  expect(getYSquareCoordinate(5)).toEqual(2);
  expect(getYSquareCoordinate(6)).toEqual(3);
  expect(getYSquareCoordinate(7)).toEqual(3);
  expect(getYSquareCoordinate(8)).toEqual(4);
  expect(getYSquareCoordinate(9)).toEqual(4);
});

test("getSquareCords", () => {
  expect(getSquareCoords(0, 0, true, true)).toStrictEqual({ x: 0, y: -1 });
  expect(getSquareCoords(0, 0, true, false)).toStrictEqual({ x: 0, y: 0 });
  expect(getSquareCoords(0, 2, true, true)).toStrictEqual({ x: 0, y: 0 });
  expect(getSquareCoords(0, 2, true, false)).toStrictEqual({ x: 0, y: 1 });

  expect(getSquareCoords(1, 0, true, true)).toStrictEqual({ x: 1, y: -1 });
  expect(getSquareCoords(1, 0, true, false)).toStrictEqual({ x: 1, y: 0 });
  expect(getSquareCoords(1, 2, true, true)).toStrictEqual({ x: 1, y: 0 });
  expect(getSquareCoords(1, 2, true, false)).toStrictEqual({ x: 1, y: 1 });

  expect(getSquareCoords(0, 1, false, true)).toStrictEqual({ x: -1, y: 0 });
  expect(getSquareCoords(0, 1, false, false)).toStrictEqual({ x: 0, y: 0 });
  expect(getSquareCoords(1, 1, false, true)).toStrictEqual({ x: 0, y: 0 });
  expect(getSquareCoords(1, 1, false, false)).toStrictEqual({ x: 1, y: 0 });

  expect(getSquareCoords(0, 3, false, true)).toStrictEqual({ x: -1, y: 1 });
  expect(getSquareCoords(0, 3, false, false)).toStrictEqual({ x: 0, y: 1 });
  expect(getSquareCoords(1, 3, false, true)).toStrictEqual({ x: 0, y: 1 });
  expect(getSquareCoords(1, 3, false, false)).toStrictEqual({ x: 1, y: 1 });
});

test("countNeighbouringEdges", () => {
  // const board = []
  // countNeighbouringEdges(x, y, board)
});
