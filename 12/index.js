import { input } from './input.js';

class Solver {
  Start = 'S'.charCodeAt(0);

  End = 'E'.charCodeAt(0);
  EndCoordinates;

  LowestPoint = 'a'.charCodeAt(0);

  HighestPoint = 'z'.charCodeAt(0);

  BaseValue = null;

  Map;

  constructor() {
    this.Map = this.parseInput();
  }

  parseInput = () =>
    input.split('\n').map((row, rowIndex) =>
      row.split('').map((col, colIndex) => {
        const charCode = col.charCodeAt(0);
        const coordinates = [rowIndex, colIndex];
        if (charCode === this.End) {
          this.EndCoordinates = coordinates;
        }
        return charCode;
      })
    );

  findShortestPath = (start) => {
    const map = this.Map;
    const destinationLevel =
      map[this.EndCoordinates[0]][this.EndCoordinates[1]];

    const queue = [start];
    const closed = Array.from({ length: map.length }).map(() =>
      Array.from({ length: map[0].length }).map(() => false)
    );
    const details = Array.from({ length: map.length }).map(() =>
      Array.from({ length: map[0].length }).map(() => ({
        distance: this.BaseValue,
        steps: this.BaseValue,
        estimation: this.BaseValue,
        parentCoordinates: this.BaseValue,
      }))
    );

    while (queue.length) {
      const currentCoordinates = queue.shift();

      const [x, y] = currentCoordinates;
      const currentLevel = map[x][y];
      const currentDetails = details[x][y];

      if (currentLevel === destinationLevel) {
        return currentDetails.steps;
      }

      const currentSteps = currentDetails.steps + 1;

      closed[x][y] = true;

      const neighborCoordinates =
        this.getNeighborCoordinates(currentCoordinates);

      for (let i = 0; i < neighborCoordinates.length; i++) {
        const neighbor = neighborCoordinates[i];
        const [xN, yN] = neighbor;
        const neighborLevel = map[xN]?.[yN];

        /** @notice Step is valid and not checked as parent,
         *          calculate estimation and compare.       */
        if (
          this.isValidStep(currentLevel, neighborLevel, map) &&
          !closed[xN][yN]
        ) {
          const newEstimation =
            currentSteps + this.getManhattanDistance(neighbor);

          const neighborDetails = details[xN][yN];
          if (
            neighborDetails.estimation === this.BaseValue ||
            neighborDetails.estimation > newEstimation
          ) {
            queue.push(neighbor);

            neighborDetails.steps = currentSteps;
            neighborDetails.estimation = newEstimation;
          }
        }
      }
    }
  };

  isValidStep = (currentLevel, targetLevel) => {
    if (targetLevel) {
      if (currentLevel === this.Start) {
        return targetLevel === this.LowestPoint;
      }
      if (currentLevel === this.HighestPoint) {
        return targetLevel === this.End;
      }
      return targetLevel <= currentLevel + 1 && targetLevel !== this.End;
    }
    return false;
  };

  getManhattanDistance = (current) => {
    const [x, y] = current;
    const [xT, yT] = this.EndCoordinates;
    return Math.abs(x - xT) + Math.abs(y - yT);
  };

  getNeighborCoordinates = (currentCoordinates) => {
    const [x, y] = currentCoordinates;
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
  };

  findShortestPathFromLevel = (level) => {
    const potentialStartingPoints =
      this.getLevelCoordinatesWithValidNeighbors(level);
    const steps = potentialStartingPoints.map((coordinates) =>
      this.findShortestPath(coordinates)
    );
    return Math.min(...steps);
  };

  getLevelCoordinatesWithValidNeighbors = (level) =>
    this.Map.reduce((acc, row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const coordinates = [rowIndex, columnIndex];
        if (
          column === level &&
          this.getNeighborCoordinates(coordinates).some((neighbor) => {
            const targetLevel = this.Map[neighbor[0]]?.[neighbor[1]];
            return (
              targetLevel !== level && this.isValidStep(level, targetLevel)
            );
          })
        ) {
          acc.push(coordinates);
        }
      });
      return acc;
    }, []);
}

const solver = new Solver();

console.log(
  'Fewest steps to reach best signal -> ',
  solver.findShortestPathFromLevel(solver.Start)
);

console.log(
  'Fewest steps from closest low point -> ',
  solver.findShortestPathFromLevel(solver.LowestPoint)
);
