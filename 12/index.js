import { input } from './input.js';

class Solver {
  Start = 'S'.charCodeAt(0);

  End = 'E'.charCodeAt(0);

  LowestPoint = 'a'.charCodeAt(0);

  HighestPoint = 'z'.charCodeAt(0);

  BaseValue = null;

  parseInput = () =>
    input
      .split('\n')
      .map((row) => row.split('').map((col) => col.charCodeAt(0)));

  findShortestPath = () => {
    const map = this.parseInput();
    const { start, destination } = this.getInitialCoordinates(map);

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
      const currentSteps = currentDetails.steps + 1;

      closed[x][y] = true;

      const neighborCoordinates =
        this.getNeighborCoordinates(currentCoordinates);

      for (let i = 0; i < neighborCoordinates.length; i++) {
        const neighbor = neighborCoordinates[i];
        const [xN, yN] = neighbor;
        const neighborLevel = map[xN]?.[yN];

        /** @notice Current is the Highest point and Neighbor is target */
        if (
          currentLevel === this.HighestPoint &&
          destination[0] === xN &&
          destination[1] === yN
        ) {
          return currentSteps;
        }

        /** @notice Step is valid and not checked as parent,
         *          calculate estimation and compare.       */
        if (
          this.isValidStep(currentLevel, neighborLevel, map) &&
          !closed[xN][yN]
        ) {
          const newDistance = this.getDistanceHeuristics(neighbor, destination);
          const newEstimation = currentSteps + newDistance;

          const neighborDetails = details[xN][yN];
          if (
            neighborDetails.estimation === this.BaseValue ||
            neighborDetails.estimation > newEstimation
          ) {
            queue.push(neighbor);

            neighborDetails.steps = currentSteps;
            neighborDetails.distance = newDistance;
            neighborDetails.estimation = newEstimation;
            neighborDetails.parentCoordinates = [...currentCoordinates];
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
      return targetLevel <= currentLevel + 1;
    }
    return false;
  };

  getDistanceHeuristics = (current, target) => {
    const [x, y] = current;
    const [xT, yT] = target;
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

  getInitialCoordinates = (map) => {
    const coordinates = {
      start: null,
      destination: null,
    };

    for (let i = 0; i < map.length; i++) {
      const row = map[i];
      for (let j = 0; j < row.length; j++) {
        const column = row[j];
        const currentCoordinates = [i, j];

        if (column === this.Start) {
          coordinates.start = currentCoordinates;
        }
        if (column === this.End) {
          coordinates.destination = currentCoordinates;
        }

        if (!!coordinates.start && !!coordinates.destination) {
          return coordinates;
        }
      }
    }

    return coordinates;
  };
}

const solver = new Solver();

console.log('Fewest steps to reach best signal -> ', solver.findShortestPath());
