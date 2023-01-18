import { input } from './input.js';

class Solver {
  getValueFromAssignment = (row) =>
    parseInt(row.substring(row.indexOf('=') + 1), 10);

  getCoordinatesFromSegment = (segment) => {
    const assignments = segment
      .substring(segment.indexOf('at') + 3)
      .split(', ');
    const x = this.getValueFromAssignment(assignments[0]);
    const y = this.getValueFromAssignment(assignments[1]);
    return [x, y];
  };

  getManhattanDistance = (from, to) =>
    Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);

  parseInput = () =>
    input.split('\n').reduce(
      (acc, current) => {
        const [sensorSegment, beaconSegment] = current.split(':');

        const sensor = this.getCoordinatesFromSegment(sensorSegment);
        const beacon = this.getCoordinatesFromSegment(beaconSegment);

        const manhattanDistance = this.getManhattanDistance(sensor, beacon);
        /**
         * Get edge coordinates for all polytopes created by
         * euclidean distance to the closest beacon
         * */
        const up = [sensor[0], sensor[1] + manhattanDistance];
        const down = [sensor[0], sensor[1] - manhattanDistance];
        const left = [sensor[0] - manhattanDistance, sensor[1]];
        const right = [sensor[0] + manhattanDistance, sensor[1]];

        acc.sensors.push({
          x: sensor[0],
          y: sensor[1],
          edges: [up, down, left, right],
        });

        const xBeacon = beacon[0];
        const yBeacon = beacon[1];

        if (!acc.beacons[yBeacon]) {
          acc.beacons[yBeacon] = {};
        }
        acc.beacons[yBeacon][xBeacon] = true;
        return acc;
      },
      {
        sensors: [],
        /** @todo --> Remove beacons */
        beacons: {},
      }
    );

  getConnectionsAtY = (sensors, y) =>
    sensors
      .reduce((acc, { edges }) => {
        const intersectionsWithX = this.getIntersectionsWithYFromEdges(
          edges,
          y
        );
        if (intersectionsWithX.length) {
          acc.push(intersectionsWithX.sort((a, b) => a - b));
        }
        return acc;
      }, [])
      .sort((a, b) => a[0] - b[0]);

  findTuningFrequency = () => {
    const { sensors, beacons } = this.parseInput();
    console.log('\n\n\n');
    console.log('Beacons --> ', beacons);
    const yRange = Object.keys(beacons).map((yBeacon) => parseInt(yBeacon, 10));
    const yMin = Math.min(...yRange);
    const yMax = Math.max(...yRange);
    for (let i = yMin; i <= yMax; i++) {
      const { encounteredFreeSpace } = this.countFilledPositionsAtY(sensors, i);
      if (encounteredFreeSpace) {
        console.log('Free space!');
      }
    }
  };

  countFilledPositionsAtY = (sensors, y) => {
    const connections = this.getConnectionsAtY(sensors, y);

    // const beaconsAtY = beacons[y];

    const firstFrom = connections[0]?.[0];
    const firstTo = connections[0]?.[1];

    const { filled, encounteredFreeSpace } = connections.reduce(
      (acc, [xFrom, xTo]) => {
        /** New line */
        if (xFrom > acc.currentEnd) {
          // acc.currentStart = xFrom;
          // acc.currentEnd = xTo ? xTo : xFrom;
          // acc.filled += this.getFilledBetween(
          //   acc.currentStart,
          //   acc.currentEnd,
          //   beaconsAtY
          // );
          console.log('\n\n');
          console.log('Hey!');
          console.log('acc -> ', acc);
          console.log('xFrom -> ', xFrom);
          console.log('xTo -> ', xTo);
          acc.encounteredFreeSpace = true;
        } else if (xTo > acc.currentEnd) {
          /** Common part got longer */
          acc.filled += this.getFilledBetween(acc.currentEnd, xTo);
          acc.currentEnd = xTo;
        }
        return acc;
      },
      {
        currentStart: firstFrom,
        currentEnd: firstTo,
        filled: this.getFilledBetween(firstFrom, firstTo),
        encounteredFreeSpace: false,
      }
    );
    return { filled, encounteredFreeSpace };
  };

  getFilledBetween = (fromX, toX) => {
    return toX - fromX;
    // const filled = toX - fromX;
    // console.log('\n');
    // console.log('__ fromX ', fromX);
    // console.log('__ toX ', toX);
    // console.log('__ filled ', filled);
    // const beaconsBetween = Object.keys(beacons).reduce((acc, xBeacon) => {
    //   const parsed = parseInt(xBeacon, 10);
    //   if (parsed >= fromX && parsed <= toX) {
    //     console.log('Beacon --> ', xBeacon)
    //     acc += 1;
    //   }
    //   return acc;
    // }, 0);
    // return filled - beaconsBetween;
  };

  getIntersectionsWithYFromEdges = (edges, y) => [
    ...edges.reduce((intersections, edge) => {
      const crossingTo = edges.find(
        ([, yEdge]) =>
          (edge[1] >= y && yEdge <= y) || (edge[1] <= y && yEdge >= y)
      );
      if (crossingTo && edge[0] !== crossingTo[0]) {
        const intersect = this.findIntersection(edge, crossingTo, y);
        intersections.add(intersect);
      }
      return intersections;
    }, new Set([])),
  ];

  findIntersection = (from, to, y) => {
    const [xFrom, yFrom] = from;
    const [xTo, yTo] = to;
    if (xFrom === xTo) {
      return xFrom;
    }
    const k = (yTo - yFrom) / (xTo - xFrom);
    return k * (y - yFrom) + xFrom;
  };
}

const solver = new Solver();

console.log(
  'Count of positions that can not contain a beacon -> ',
  solver.countFilledPositionsAtY(solver.parseInput().sensors, 10)
);

console.log(
  'Tuning frequency of only hidden beacon -> ',
  solver.findTuningFrequency()
);
