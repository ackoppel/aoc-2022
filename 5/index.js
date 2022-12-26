import { initialCrates, input } from './input.js';

class Solver {
  MoverType = {
    firstGen: 'firstGen',
    secondGen: 'secondGen',
  };

  parseInput = () => input.split('\n');
  parseMove = (move, stack) => {
    const split = move.split(' ');
    return {
      count: parseInt(split[1], 10),
      from: stack[parseInt(split[3], 10) - 1],
      to: stack[parseInt(split[5], 10) - 1],
    };
  };

  parseInitialCratesStack = () => {
    const rows = initialCrates.split('\n');
    // remove column numbers
    rows.pop();

    const stacks = [];

    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      let stackIndex = 0;
      for (let j = 0; j < row.length - 1; j += 4) {
        const current = row.slice(j, j + 3);
        if (current.startsWith('[')) {
          if (stacks[stackIndex]) {
            stacks[stackIndex].push(current);
          } else {
            stacks.push([current]);
          }
        }
        stackIndex += 1;
      }
      stackIndex = 0;
    }

    return stacks;
  };

  findFinalTopCreates = (moverType) => {
    const cratesStack = this.parseInitialCratesStack();
    const moves = this.parseInput();
    moves.forEach((move) =>
      moverType === this.MoverType.firstGen
        ? this.moveCratesByOne(move, cratesStack)
        : this.moveCratesAtOnce(move, cratesStack)
    );
    return cratesStack.map((column) => column[column.length - 1][1]).join('');
  };

  moveCratesByOne = (move, stack) => {
    const { count, from, to } = this.parseMove(move, stack);
    for (let i = 0; i < count; i++) {
      to.push(from.pop());
    }
  };

  moveCratesAtOnce = (move, stack) => {
    const { count, from, to } = this.parseMove(move, stack);
    to.push(...from.splice(from.length - count));
  };
}

const solver = new Solver();

console.log(
  'Final top creates [CrateMover-9000] -> ',
  solver.findFinalTopCreates(solver.MoverType.firstGen)
);
console.log(
  'Final top creates [CrateMover-9001] -> ',
  solver.findFinalTopCreates(solver.MoverType.secondGen)
);
