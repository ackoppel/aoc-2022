import { input } from './input.js';

class Solver {
  parseInput = () => input.split('\n');

  findVisibleTreesCount = () => {
    const rows = this.parseInput();
    const coordinates = {};

    rows.forEach((row, rowIndex) =>
      row.split('').forEach((val, columnIndex, arr) => {
        const columnValue = parseInt(val, 10);

        const visibleFromLeft = !arr
          .slice(0, columnIndex)
          .some((val) => this.isHidden(columnValue, val));

        const visibleFromRight = !arr
          .slice(columnIndex + 1)
          .some((val) => this.isHidden(columnValue, val));

        const visibleFromTop = !rows
          .slice(0, rowIndex)
          .some((row) => this.isHidden(columnValue, row[columnIndex]));

        const visibleFromBottom = !rows
          .slice(rowIndex + 1)
          .some((row) => this.isHidden(columnValue, row[columnIndex]));

        if (
          visibleFromLeft ||
          visibleFromRight ||
          visibleFromTop ||
          visibleFromBottom
        ) {
          coordinates[`${columnIndex}-${rowIndex}`] = true;
        }
      })
    );

    return Object.values(coordinates).filter((val) => !!val).length;
  };

  findHighestScenicScore = () => {
    const rows = this.parseInput();
    return rows.reduce((acc, row, rowIndex) => {
      row.split('').forEach((val, columnIndex, arr) => {
        const columnValue = parseInt(val, 10);

        const visibleFromLeft = this.countVisible(
          columnValue,
          arr.slice(0, columnIndex).reverse()
        );

        const visibleFromRight = this.countVisible(
          columnValue,
          arr.slice(columnIndex + 1)
        );

        const visibleFromTop = this.countVisible(
          columnValue,
          rows
            .slice(0, rowIndex)
            .map((r) => r[columnIndex])
            .reverse()
        );

        const visibleFromBottom = this.countVisible(
          columnValue,
          rows.slice(rowIndex + 1).map((r) => r[columnIndex])
        );

        const scenicScore =
          visibleFromLeft *
          visibleFromRight *
          visibleFromTop *
          visibleFromBottom;

        if (scenicScore > acc) {
          acc = scenicScore;
        }
      });

      return acc;
    }, 0);
  };

  isHidden = (columnValue, valueToCompare) => {
    const parsed = parseInt(valueToCompare, 10);
    return parsed > columnValue || parsed === columnValue;
  };

  countVisible = (columnValue, orderedValues) => {
    if (orderedValues.length) {
      const blockerIndex = orderedValues.findIndex(
        (val) => parseInt(val) >= columnValue
      );
      return blockerIndex >= 0 ? blockerIndex + 1 : orderedValues.length;
    }
    return 0;
  };
}

const solver = new Solver();

console.log(
  'Visible trees from outside the grid -> ',
  solver.findVisibleTreesCount()
);

console.log('Highest scenic score -> ', solver.findHighestScenicScore());
