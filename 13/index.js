import { input } from './input.js';

class Solver {
  /** Returns pairs */
  parseInput = () => input.split(`\n\n`);
  parseRow = (row) => JSON.parse(row);

  getSumOfIndicesOfOrderedPairs = () =>
    this.parseInput().reduce((acc, current, index) => {
      const [first, second] = current.split('\n').map(this.parseRow);
      const { ordered } = this.pairIsOrdered(first, second);
      if (ordered) {
        acc += index + 1;
      }
      return acc;
    }, 0);

  pairIsOrdered = (left, right) => {
    const result = {
      ordered: false,
      /** Needed to determine if recursive call found a comparison for decision */
      itemFound: false,
    };

    for (let i = 0; i < left.length; i++) {
      const elementFromLeft = left[i];
      const elementFromRight = right[i];

      /** Right ends first */
      if (elementFromRight === undefined) {
        result.itemFound = true;
        return result;
      }

      /** One of the elements is an array, recursive call */
      if (Array.isArray(elementFromLeft) || Array.isArray(elementFromRight)) {
        const { itemFound, ordered } = this.pairIsOrdered(
          this.getElementRepresentation(elementFromLeft),
          this.getElementRepresentation(elementFromRight)
        );
        if (itemFound) {
          result.ordered = ordered;
          result.itemFound = true;
          return result;
        }
      } else if (elementFromLeft !== elementFromRight) {
        /** First elements that can be compared */
        result.ordered = elementFromLeft < elementFromRight;
        result.itemFound = true;
        return result;
      }
    }

    /** Left ends first OR no item to compare was yet found */
    const found = left.length < right.length;
    result.ordered = found;
    result.itemFound = found;
    return result;
  };

  getElementRepresentation = (element) =>
    !Array.isArray(element) ? [element] : element;
}

const solver = new Solver();

console.log(
  'Sum of indices of ordered pairs -> ',
  solver.getSumOfIndicesOfOrderedPairs()
);
