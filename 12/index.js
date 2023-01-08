import { input } from './input.js';

class Solver {
  Start = 'S'.charCodeAt(0);

  End = 'E'.charCodeAt(0);

  HighestPoint = 'z'.charCodeAt(0);

  parseInput = () =>
    input
      .split('\n')
      .map((row) => row.split('').map((col) => col.charCodeAt(0)));

  mapCoordinatesByLevel = (map, level) =>
    map.reduce((acc, current, x) => {
      current.forEach((value, y) => {
        if (map[x][y] === level) {
          acc[`${x}-${y}`] = {
            x,
            y,
            value,
          };
        }
      });
      return acc;
    }, {});

  findShortestPathToSignal = () => {
    const map = this.parseInput();
    const { start, destination } = this.getInitialCoordinates(map);
    console.log('Start -> ', start);
    console.log('Destination -> ', destination);
    const pathToDestination = this.findPathToDestination(
      destination,
      start,
      map,
      [start]
    );
    console.log('Path to destination -> ', pathToDestination);

    return pathToDestination;
  };

  findShortestPath = () => {
    const map = this.parseInput();
    const { start, destination } = this.getInitialCoordinates(map);
    const path = this.findPathToNextLevel(start, destination, map, [start]);
  };

  findPathToNextLevel = (currentCoordinates, destination, map, visitedPath) => {
    const currentLevel = map[currentCoordinates[0]][currentCoordinates[1]];
    const targetLevel =
      currentLevel === this.HighestPoint ? this.End : currentLevel + 1;

    const targetLevelMapping = this.mapCoordinatesByLevel(map, targetLevel);
    /** @todo -> Find closest coordinate (Linear path) */
    const { /*closestPoint,*/ directNeighbors } =
      this.findClosestPointToTargetLevel(
        currentCoordinates,
        targetLevelMapping,
        map
      );

    if (directNeighbors.length) {
      const paths = directNeighbors.map((n) =>
        this.findPathToNextLevel(n, destination, map, [...visitedPath, n])
      );
      return paths.length ? Math.min(...paths) : null;
    }

    /** @todo -> Map coordinates as close as possible to the Linear path */
    // if (closestPoint) {
    //
    // }
  };

  findClosestPointToTargetLevel = (
    currentCoordinates,
    targetLevelMapping,
    map
  ) => {
    const currentLevel = map[currentCoordinates[0]][currentCoordinates[1]];
    return Object.values(targetLevelMapping).reduce(
      (acc, current) => {
        const { x, y } = current;
        const neighbors = this.getNeighborCoordinates([x, y]);
        if (
          neighbors.some(
            (coordinates) =>
              map[coordinates[0]]?.[coordinates[1]] === currentLevel
          )
        ) {
          // Check if direct neighbor
          const directNeighbor = neighbors.find(
            ([xN, yN]) =>
              xN === currentCoordinates[0] && yN === currentCoordinates[1]
          );
          if (directNeighbor) {
            acc.directNeighbors.push(directNeighbor);
            return acc;
          }

          // Calculate distance
          const distance = this.getDistanceBetweenPoints(
            currentCoordinates,
            current
          );
          if (distance < acc.closestDistance) {
            acc.closestPoint = current;
            acc.closestDistance = distance;
          }
        }
        return acc;
      },
      { closestPoint: null, closestDistance: 0, directNeighbors: [] }
    );
  };

  getDistanceBetweenPoints = (from, to) => {
    const [x, y] = from;
    const [xT, yT] = to;

    const xDiffSquared = (xT - x) ** 2;
    const yDiffSquared = (yT - y) ** 2;
    return Math.sqrt(xDiffSquared + yDiffSquared);
  };

  findPathToDestination = (
    destination,
    currentCoordinates,
    map,
    visitedCoordinates
  ) => {
    const neighborsToVisit = this.getNeighborsToVisit(
      currentCoordinates,
      map,
      visitedCoordinates
    );
    if (!neighborsToVisit.length) {
      return null;
    }
    if (
      neighborsToVisit.find(
        (n) => n[0] === destination[0] && n[1] === destination[1]
      )
    ) {
      return visitedCoordinates.length;
    }
    const paths = neighborsToVisit.map((neighbor) =>
      this.findPathToDestination(destination, neighbor, map, [
        ...visitedCoordinates,
        neighbor,
      ])
    );

    const acceptablePaths = paths.filter((item) => !!item);
    return acceptablePaths.length ? Math.min(...acceptablePaths) : null;
  };

  getNeighborsToVisit = (currentCoordinates, map, visitedCoordinates) => {
    const [x, y] = currentCoordinates;
    const currentElement = map[x][y];
    return this.getNeighborCoordinates(currentCoordinates).filter(
      (coordinates) => {
        const [xN, yN] = coordinates;
        const elementOnMap = map[xN]?.[yN];

        const achievableElement =
          elementOnMap &&
          (currentElement === this.Start ||
            elementOnMap - 1 === currentElement ||
            elementOnMap === currentElement);

        return (
          (currentElement === this.HighestPoint && elementOnMap === this.End) ||
          (achievableElement &&
            !visitedCoordinates.some(
              (visited) => visited[0] === xN && visited[1] === yN
            ))
        );
      }
    );
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

/**
 * 1st Solution is too slow
 *
 *
 * 2nd Idea
 *
 * - from each unique character find the cheapest path to next unique character
 *
 * */

console.log(
  'Fewest steps to reach best signal -> ',
  solver.findShortestPathToSignal()
);
