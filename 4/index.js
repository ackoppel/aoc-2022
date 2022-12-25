import { input } from './input.js';

class Solver {
  parseInput = () => input.split('\n');
  parsePair = (row) /* : [[1,2], [3,4]] */ =>
    row
      .split(',')
      .map((range) => range.split('-').map((val) => parseInt(val, 10)));

  countFullyOverlappingPairs = () =>
    this.parseInput().reduce((acc, current) => {
      const [first, second] = this.parsePair(current);
      if (
        // First contains second
        (first[0] <= second[0] && first[1] >= second[1]) ||
        // Second contains first
        (first[0] >= second[0] && first[1] <= second[1])
      ) {
        acc += 1;
      }
      return acc;
    }, 0);

  countPartiallyOverlappingPairs = () =>
    this.parseInput().reduce((acc, current) => {
      const [first, second] = this.parsePair(current);
      if (
        // Second starts inside first
        (first[0] <= second[0] && first[1] >= second[0]) ||
        // Second ends inside first
        (first[0] <= second[1] && first[1] >= second[1]) ||
        // Second contains first
        (first[0] >= second[0] && first[1] <= second[1])
      ) {
        acc += 1;
      }
      return acc;
    }, 0);
}

const solver = new Solver();

console.log(
  'Count Fully overlapping pairs -> ',
  solver.countFullyOverlappingPairs()
);

console.log(
  'Count Partially overlapping pairs -> ',
  solver.countPartiallyOverlappingPairs()
);
