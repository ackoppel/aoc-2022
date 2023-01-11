import { input } from './input.js';

class Solver {
  /** Returns pairs */
  parseInput = () => input.split(`\n\n`);
  /** @param row {string} */
  parseRow = (row) => row.split('\n').map((r) => JSON.parse(r));

  /** PT II */
  dividerPackets = [[[2]], [[6]]];

  /** @notice PT I */
  getSumOfIndicesOfOrderedPairs = () =>
    this.parseInput().reduce((acc, current, index) => {
      const [first, second] = this.parseRow(current);
      const { ordered } = this.pairIsOrdered(first, second);
      if (ordered) {
        acc += index + 1;
      }
      return acc;
    }, 0);

  /** @notice PT II */
  findDecoderKey = () => {
    const dividersAsStrings = this.dividerPackets.map((packet) =>
      JSON.stringify(packet)
    );
    return [
      ...this.dividerPackets,
      ...this.parseInput().reduce(
        (acc, current) => [...acc, ...this.parseRow(current)],
        []
      ),
    ]
      .sort((a, b) => (this.pairIsOrdered(a, b).ordered ? -1 : 1))
      .reduce((acc, current, index) => {
        if (dividersAsStrings.includes(JSON.stringify(current))) {
          acc *= index + 1;
        }
        return acc;
      }, 1);
  };

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

console.log('Distress signal decoder key -> ', solver.findDecoderKey());
