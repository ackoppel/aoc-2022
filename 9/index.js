import { input } from './input.js';

class Solver {
  Move = {
    Left: 'L',
    Right: 'R',
    Down: 'D',
    Up: 'U',
  };

  parseInput = () => input.split('\n');

  countPositionsVisitedByTail = (knots) =>
    Object.values(
      this.parseInput().reduce(
        (acc, current) => {
          const [direction, steps] = current.split(' ');
          const stepsCount = parseInt(steps, 10);

          for (let i = 0; i < stepsCount; i++) {
            const head = acc.positions[0];
            this.moveHead(head, direction);

            for (let knotIndex = 1; knotIndex <= knots - 1; knotIndex++) {
              this.moveTailKnotToNewPosition(
                acc.positions,
                acc.visitedByTail,
                knotIndex
              );
            }
          }

          return acc;
        },
        {
          positions: Array.from({ length: knots }).map(() => [0, 0]),
          visitedByTail: { '0-0': true },
        }
      ).visitedByTail
    ).length;

  moveHead = (position, direction) => {
    switch (direction) {
      case this.Move.Left:
        position[0] -= 1;
        break;
      case this.Move.Right:
        position[0] += 1;
        break;
      case this.Move.Down:
        position[1] -= 1;
        break;
      default:
        position[1] += 1;
    }
  };

  moveTailKnotToNewPosition = (
    coordinatesList,
    visitedByTail,
    currentIndex
  ) => {
    const prevKnot = coordinatesList[currentIndex - 1];
    const currentKnot = coordinatesList[currentIndex];

    const possibleNeighborDiffs = [-1, 0, 1];
    const xDiff = prevKnot[0] - currentKnot[0];
    const yDiff = prevKnot[1] - currentKnot[1];

    if (
      !possibleNeighborDiffs.includes(xDiff) ||
      !possibleNeighborDiffs.includes(yDiff)
    ) {
      const absoluteXDiff = Math.abs(xDiff);
      const absoluteYDiff = Math.abs(yDiff);

      const xMoved = absoluteXDiff === 2;
      const yMoved = absoluteYDiff === 2;

      const newX =
        // horizontal || diagonal
        xMoved || (yMoved && absoluteXDiff === 1)
          ? currentKnot[0] + (xDiff > 0 ? 1 : -1)
          : currentKnot[0];
      const newY =
        // vertical || diagonal
        yMoved || (xMoved && absoluteYDiff === 1)
          ? currentKnot[1] + (yDiff > 0 ? 1 : -1)
          : currentKnot[1];

      coordinatesList[currentIndex] = [newX, newY];

      if (currentIndex === coordinatesList.length - 1) {
        visitedByTail[`${newX}-${newY}`] = true;
      }
    }
  };
}

const solver = new Solver();

console.log(
  'Positions visited by tail (2 knots) -> ',
  solver.countPositionsVisitedByTail(2)
);

console.log(
  'Positions visited by tail (10 knots) -> ',
  solver.countPositionsVisitedByTail(10)
);
