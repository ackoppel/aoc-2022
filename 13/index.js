import { input } from './input.js';

class Solver {
  /** Returns pairs */
  parseInput = () => input.split(`\n\n`);
  parseRow = (row) => JSON.parse(row);

  getSumOfIndicesOfOrderedPairs = () =>
    this.parseInput().reduce((acc, current, index) => {
      const [first, second] = current.split('\n').map(this.parseRow);
      // console.log('\n\n\n ____ PAIR ____');
      // console.log('First -> ', first);
      // console.log('Second -> ', second);
      const { ordered, itemFound } = this.pairIsOrdered(first, second);
      // console.log('___ ORDERED --> ', ordered);
      if (ordered) {
        acc += index + 1;
      }
      return acc;
    }, 0);

  pairIsOrdered = (left, right) => {
    /** @todo -> Case when 1 is integer and need to be converted to an array */
    // if (Array.isArray(left) && Number.isInteger(right)) {
    //   console.log('\n\n\n');
    //   console.log('Left -> ', left);
    //   console.log('Right -> ', right);
    //   return !!left.length ? left[0] <= right : true;
    // }
    // if (Number.isInteger(left) && Array.isArray(right)) {
    //   console.log('\n\n\n');
    //   console.log('Left -> ', left);
    //   console.log('Right -> ', right);
    //   return !!right.length ? left <= right[0] : false;
    // }
    if (left.length === 0 && right.length === 0) {
      console.log('\n\n\n');
      console.log('Left -> ', left);
      console.log('Right -> ', right);
    }

    /** -- -- */
    const result = {
      ordered: false,
      itemFound: false,
    };

    for (let i = 0; i < left.length; i++) {
      const elementFromLeft = left[i];
      const elementFromRight = right[i];

      /** Right ends first */
      if (!elementFromRight) {
        result.itemFound = true;
        return result;
        // return false;
      }

      /** One of the elements is an array, recursive call */
      if (Array.isArray(elementFromLeft) || Array.isArray(elementFromRight)) {
        // console.log('\n\n\n');
        // console.log(
        //   'Left (getElementRepresentation)-> ',
        //   this.getElementRepresentation(elementFromLeft)
        // );
        // console.log(
        //   'Right (getElementRepresentation) -> ',
        //   this.getElementRepresentation(elementFromRight)
        // );

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
        result.ordered = elementFromLeft < elementFromRight;
        result.itemFound = true;
        return result;
      }
    }

    /** Left ends first OR no item to compare was yet found */
    // return true;

    const found = left.length < right.length;
    console.log('Left is shorter --> ', found);
    result.ordered = found;
    result.itemFound = found;
    return result;
  };

  // pairIsOrdered = (left, right) => {
  //   /** @todo -> Case when 1 is integer and need to be converted to an array */
  //   if (Array.isArray(left) && Number.isInteger(right)) {
  //     console.log('\n\n\n');
  //     console.log('Left -> ', left);
  //     console.log('Right -> ', right);
  //     return !!left.length ? left[0] <= right : true;
  //   }
  //   if (Number.isInteger(left) && Array.isArray(right)) {
  //     console.log('\n\n\n');
  //     console.log('Left -> ', left);
  //     console.log('Right -> ', right);
  //     return !!right.length ? left <= right[0] : false;
  //   }
  //   /** -- -- */
  //
  //   for (let i = 0; i < left.length; i++) {
  //     const elementFromLeft = left[i];
  //     const elementFromRight = right[i];
  //
  //     /** Right ends first */
  //     if (!elementFromRight) {
  //       return false;
  //     }
  //
  //     /** One of the elements is an array, recursive call */
  //     if (Array.isArray(elementFromLeft) || Array.isArray(elementFromRight)) {
  //       const ordered = this.pairIsOrdered(elementFromLeft, elementFromRight);
  //       if (!ordered) {
  //         return false;
  //       }
  //     } else if (elementFromLeft > elementFromRight) {
  //       return false;
  //     }
  //   }
  //
  //   /** Left ends first and is ordered compared to right */
  //   return true;
  // };

  /** @notice V1 */
  // compareLevel = (left, right) => {
  //   for (let i = 0; i < left.length; i++) {
  //     /** Right ends first */
  //     if (!right[i]) {
  //       console.log('\n\n **** RIGHT ENDS FIRST **** ');
  //       return false;
  //     }
  //
  //     const elementFromLeft = this.getElementRepresentation(
  //       left[i],
  //       Array.isArray(right[i])
  //     );
  //     console.log('\n\n');
  //     console.log('Element from left -> ', elementFromLeft);
  //     const elementFromRight = this.getElementRepresentation(
  //       right[i],
  //       Array.isArray(elementFromLeft)
  //     );
  //     console.log('Element from right -> ', elementFromRight);
  //
  //     // One of the elements could be an array, recursive call
  //     if (Array.isArray(elementFromLeft) && Array.isArray(elementFromRight)) {
  //       const ordered = this.compareLevel(elementFromLeft, elementFromRight);
  //       if (!ordered) {
  //         return false;
  //       }
  //     } else if (elementFromLeft > elementFromRight) {
  //       return false;
  //     }
  //   }
  //
  //   /** Left ends first and is ordered compared to right */
  //   return true;
  // };

  getElementRepresentation = (element) =>
    !Array.isArray(element) ? [element] : element;
}

const solver = new Solver();

console.log(
  'Sum of indices of ordered pairs -> ',
  solver.getSumOfIndicesOfOrderedPairs()
);
