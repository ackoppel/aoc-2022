import { input } from './input.js';

class Solver {
  SandSource = [500, 0];

  FieldSymbol = {
    Empty: '.',
    Rock: '#',
    Sand: 'O',
  };

  parseInput = () =>
    input.split('\n').reduce(
      (acc, path) => {
        const pathPoints = path.split(' -> ').map((coordinates) => {
          const split = coordinates.split(',');
          const [x, y] = [parseInt(split[0], 10), parseInt(split[1], 10)];

          /** X range */
          if (acc.xMin > x) {
            acc.xMin = x;
          }
          if (acc.xMax < x) {
            acc.xMax = x;
          }

          /** Y range */
          if (acc.yMin > y) {
            acc.yMin = y;
          }
          if (acc.yMax < y) {
            acc.yMax = y;
          }

          return [x, y];
        });
        acc.paths = [...acc.paths, pathPoints];
        return acc;
      },
      {
        paths: [],
        xMin: this.SandSource[0],
        xMax: this.SandSource[0],
        yMin: this.SandSource[1],
        yMax: this.SandSource[1],
      }
    );

  generateMap = ({ withFloor }) => {
    const { paths, xMin, xMax, yMin, yMax } = this.parseInput();
    const field = this.generateField({ yMin, yMax, xMin, xMax, withFloor });
    paths.forEach((pathConnections) => {
      for (const [connectionIndex, [x, y]] of Object.entries(pathConnections)) {
        const from = pathConnections[connectionIndex - 1];
        if (from) {
          const [xFrom, yFrom] = from;
          const xDiff = xFrom - x;
          if (xDiff !== 0) {
            this.getNumbersBetween(xFrom, x).forEach((xTo) => {
              field[y][xTo] = this.FieldSymbol.Rock;
            });
          } else {
            this.getNumbersBetween(yFrom, y).forEach((yTo) => {
              field[yTo][x] = this.FieldSymbol.Rock;
            });
          }
        }

        field[y][x] = this.FieldSymbol.Rock;
      }
    });
    return field;
  };

  getNumbersBetween = (n1, n2) => {
    const sorted = [n1, n2].sort((a, b) => a - b);
    const numbers = [];
    for (let i = sorted[0] + 1; i < sorted[1]; i++) {
      numbers.push(i);
    }
    return numbers;
  };

  generateField = ({ yMin, yMax, xMin, xMax, withFloor }) => {
    const yLast = withFloor ? yMax + 2 : yMax;
    const xMapping = {};
    for (let i = xMin; i <= xMax; i++) {
      xMapping[i] = this.FieldSymbol.Empty;
    }
    const field = {};
    for (let i = yMin; i <= yLast; i++) {
      if (withFloor && i === yLast) {
        /** Add "Rock" symbol instead of object for easy access */
        field[i] = this.FieldSymbol.Rock;
      } else {
        field[i] = { ...xMapping };
      }
    }
    return field;
  };

  fillMapWithSand = ({ withFloor }) => {
    const map = this.generateMap({ withFloor });
    let filled = false;
    let count = 0;
    while (!filled) {
      const resting = this.generateSand(map);
      if (resting) {
        count += 1;
      } else {
        if (withFloor) {
          count += 1;
        }
        filled = true;
      }
    }
    this.printMap(map);
    return count;
  };

  /** @param map {Record<number, Record<number, string>>} */
  printMap = (map) => {
    Object.entries(map).forEach(([key, row]) => {
      console.log(`#${key} : `, Object.values(row).join(''));
    });
  };

  generateSand = (map) => {
    let currentPosition = [...this.SandSource];
    let filled = false;
    while (!filled) {
      const [x, y] = currentPosition;
      const under = map[y + 1];

      /**
       * -- PT II --
       * Filled if sand reaches top
       * */
      const filledBelowGenerator =
        y === this.SandSource[1] &&
        [under[x], under[x + 1], under[x - 1]].every(
          (v) => v === this.FieldSymbol.Sand
        );
      const aboveExtendedFloor = under === this.FieldSymbol.Rock;

      if (aboveExtendedFloor || filledBelowGenerator) {
        map[y][x] = this.FieldSymbol.Sand;
        return !!aboveExtendedFloor;
      }

      /** Falling down, account for unmapped width */
      if (under?.[x] === this.FieldSymbol.Empty || (!!under && !under[x])) {
        currentPosition = [x, y + 1];
        continue;
      }

      /** Left, account for unmapped width  */
      const left = under?.[x - 1];
      if (left === this.FieldSymbol.Empty || (!!under && !left)) {
        currentPosition = [x - 1, y + 1];
        continue;
      }

      /** Right, account for unmapped width  */
      const right = under?.[x + 1];
      if (right === this.FieldSymbol.Empty || (!!under && !right)) {
        currentPosition = [x + 1, y + 1];
        continue;
      }

      if (!right || !left) {
        return false;
      }

      map[y][x] = this.FieldSymbol.Sand;
      filled = true;
    }
    return true;
  };
}

const solver = new Solver();

console.log(
  'Units of sand that come to rest on structure -> ',
  solver.fillMapWithSand({})
);

console.log(
  'Units of sand that come to rest on floor -> ',
  solver.fillMapWithSand({ withFloor: true })
);
