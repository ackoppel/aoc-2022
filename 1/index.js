import { input } from './input.js';

class Solver {
  /** @notice PART I */
  findLargest = () =>
    this.parseInput().reduce(
      (acc, current) => {
        if (current) {
          acc.currentSum += parseInt(current, 10);
        } else {
          if (acc.currentSum > acc.largest) {
            acc.largest = acc.currentSum;
          }
          acc.currentSum = 0;
        }
        return acc;
      },
      {
        currentSum: 0,
        largest: 0,
      }
    ).largest;

  /** @notice Part II */
  findTopThree = () =>
    this.parseInput()
      .reduce(
        (acc, current) => {
          if (current) {
            acc.currentSum += parseInt(current, 10);
          } else {
            if (acc.top.length < 3) {
              // Fill initial top
              acc.top.push(acc.currentSum);
            } else {
              // Make sure it's sorted ASC
              acc.top.sort((a, b) => a - b);
              // First smaller entry
              const largerThanIndex = acc.top.findIndex(
                (sum) => sum < acc.currentSum
              );
              // Replace found index
              if (largerThanIndex > -1) {
                acc.top.splice(largerThanIndex, 1, acc.currentSum);
              }
            }
            acc.currentSum = 0;
          }
          return acc;
        },
        {
          currentSum: 0,
          top: [],
        }
      )
      .top.reduce((acc, current) => acc + current, 0);

  parseInput = () => input.split('\n');
}

const solver = new Solver();

console.log('Largest: ', solver.findLargest());
console.log('Top Three Sum: ', solver.findTopThree());
