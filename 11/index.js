import { input } from './input.js';

class Solver {
  Operator = {
    Multiply: '*',
    Add: '+',
  };

  PrevValRef = 'old';

  /** @notice https://en.wikipedia.org/wiki/Chinese_remainder_theorem */
  ModAll = 1;

  getLevelOfMonkeyBusiness = ({ rounds, divide = false }) => {
    const monkeys = this.parseInput();
    this.playRounds(monkeys, rounds, divide);
    const sorted = Object.values(monkeys).sort(
      (a, b) => b.inspectedItems - a.inspectedItems
    );
    return sorted[0].inspectedItems * sorted[1].inspectedItems;
  };

  playRounds = (monkeys, rounds, divide) => {
    const keys = Object.keys(monkeys);
    for (let i = 0; i < rounds; i++) {
      keys.forEach((monkeyKey) => {
        const currentMonkey = monkeys[monkeyKey];
        while (currentMonkey.items.length) {
          const itemToInspect = currentMonkey.items.shift();
          const { newFearLevel, nextMonkey } = currentMonkey.inspectItem({
            item: itemToInspect,
            divide,
          });
          monkeys[nextMonkey].items.push(newFearLevel);
          currentMonkey.inspectedItems += 1;
        }
      });
    }
    this.ModAll = 1;
  };

  parseInput = () =>
    input.split('\n\n').reduce((acc, current, index) => {
      const rows = current.split('\n');

      /** Starting items */
      const items = rows[1]
        .slice(rows[1].indexOf(':') + 2)
        .split(', ')
        .map((val) => parseInt(val, 10));

      /** New fear level operation */
      const operationFragments = rows[2]
        .slice(rows[2].indexOf('=') + 2)
        .split(' ');
      const [first, operator, second] = operationFragments;

      /** Next monkey conditions */
      const divisibleBy = parseInt(
        rows[3].slice(rows[3].indexOf('by') + 3),
        10
      );

      const truthyCase = this.getMonkeyFromCondition(rows[4]);
      const falsyCase = this.getMonkeyFromCondition(rows[5]);

      this.ModAll *= divisibleBy;

      acc[index] = {
        items,
        inspectedItems: 0,
        inspectItem: ({ item, divide }) => {
          const firstValue = this.getValueForOperation(first, item);
          const secondValue = this.getValueForOperation(second, item);

          const operationResult =
            operator === this.Operator.Add
              ? this.add(firstValue, secondValue)
              : this.multiply(firstValue, secondValue);

          const newFearLevel = !!divide
            ? Math.floor(operationResult / 3)
            : operationResult % this.ModAll;

          return {
            newFearLevel,
            nextMonkey: this.isDivisible(newFearLevel, divisibleBy)
              ? truthyCase
              : falsyCase,
          };
        },
      };

      return acc;
    }, {});

  getValueForOperation = (value, prevValue) =>
    value === this.PrevValRef ? prevValue : parseInt(value, 10);

  add = (first, second) => first + second;

  multiply = (first, second) => first * second;

  isDivisible = (item, divisibleBy) => item % divisibleBy === 0;

  getMonkeyFromCondition = (inputRow) => inputRow[inputRow.length - 1];
}

const solver = new Solver();

console.log(
  'Level of monkey business (20 rounds) -> ',
  solver.getLevelOfMonkeyBusiness({ rounds: 20, divide: true })
);

console.log(
  'Level of monkey business (10000 rounds) -> ',
  solver.getLevelOfMonkeyBusiness({ rounds: 10000 })
);
