import { input } from './input.js';

class Solver {
  Start = 'S'.charCodeAt(0);

  End = 'E'.charCodeAt(0);

  HighestPoint = 'z'.charCodeAt(0);

  parseInput = () =>
    input
      .split('\n')
      .map((row) => row.split('').map((col) => col.charCodeAt(0)));

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
      // console.log('Neighbors to visit, found highest -> ', neighborsToVisit);
      return visitedCoordinates.length;
    }
    const paths = neighborsToVisit.map((neighbor) =>
      this.findPathToDestination(destination, neighbor, map, [
        ...visitedCoordinates,
        neighbor,
      ])
    );

    // console.log('Paths -> ', paths);

    const acceptablePaths = paths.filter((item) => !!item);
    if (acceptablePaths.length) {
      // console.log('Acceptable lengths -> ', acceptablePaths);
    }
    return acceptablePaths.length ? Math.min(...acceptablePaths) : null;
  };

  getNeighborsToVisit = (currentCoordinates, map, visitedCoordinates) => {
    // console.log('Current coordinates -> ', currentCoordinates);

    const [x, y] = currentCoordinates;
    const currentElement = map[x][y];
    return [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ].filter((coordinates) => {
      const [xN, yN] = coordinates;
      const elementOnMap = map[xN]?.[yN];
      if (
        currentElement === this.HighestPoint &&
        elementOnMap === this.End
      ) {
        // console.log('\n\n\n Found z');
        // console.log('currentElement -> ', currentElement);
        // console.log('elementOnMap -> ', elementOnMap);
        // console.log('coordinates -> ', coordinates);
        // console.log('visited -> ', visitedCoordinates);
      }

      // if (elementOnMap >= currentElement) {
      //   console.log('\n\n\n');
      //   console.log('elementOnMap -> ', elementOnMap);
      //   console.log('currentElement -> ', currentElement);
      // }

      // if (
      //   elementOnMap - 1 === currentElement ||
      //   elementOnMap === currentElement
      // ) {
      //   console.log('\n\n\n');
      //   console.log('elementOnMap -> ', elementOnMap);
      //   console.log('currentElement -> ', currentElement);
      // }
      const achievableElement =
        elementOnMap &&
        (currentElement === this.Start ||
          elementOnMap - 1 === currentElement ||
          elementOnMap === currentElement);

      return (
        (currentElement === this.HighestPoint &&
          elementOnMap === this.End) ||
        (achievableElement &&
          !visitedCoordinates.some(
            (visited) => visited[0] === xN && visited[1] === yN
          ))
      );

      // (elementOnMap - 1 === currentElement ||
      //   elementOnMap === currentElement)
    });
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
