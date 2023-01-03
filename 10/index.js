import { input } from './input.js';

class Solver {
  Instruction = {
    addx: {
      name: 'addx',
      cycles: 2,
    },
    noop: {
      name: 'noop',
      cycles: 1,
    },
  };

  /** @notice Part I */
  StrengthCheckPoint = {
    20: true,
    60: true,
    100: true,
    140: true,
    180: true,
    220: true,
  };

  /** @notice Part II */
  PixelRowLength = 40;

  VisiblePixels = 3;

  Symbol = {
    Visible: '#',
    Hidden: '.',
  };

  parseInput = () => input.split('\n');

  mapInput = () =>
    this.parseInput().reduce(
      (acc, current) => {
        const [prefix, value] = current.split(' ');
        const instruction = this.Instruction[prefix];

        for (let i = 0; i < instruction.cycles; i++) {
          /** @notice Part I */
          const checkpoint = this.StrengthCheckPoint[acc.cycle];
          if (checkpoint) {
            acc.checkpointsSum += acc.cycle * acc.sum;
          }

          /** @notice Part II */
          const currentPixelsRow = acc.pixels[acc.pixels.length - 1];
          const pixelIndex =
            acc.cycle % this.PixelRowLength || this.PixelRowLength;

          if (
            pixelIndex >= acc.sum &&
            pixelIndex <= acc.sum + this.VisiblePixels - 1
          ) {
            currentPixelsRow.push(this.Symbol.Visible);
          } else {
            currentPixelsRow.push(this.Symbol.Hidden);
          }

          if (pixelIndex === this.PixelRowLength) {
            acc.pixels.push([]);
          }

          acc.cycle += 1;
        }

        if (instruction.name === this.Instruction.addx.name) {
          const valueToAdd = parseInt(value, 10);
          acc.sum += valueToAdd;
        }

        return acc;
      },
      {
        cycle: 1,
        sum: 1,
        checkpointsSum: 0,
        pixels: [[]],
      }
    );

  findStrengthsSum = () => this.mapInput().checkpointsSum;

  printPixels = () =>
    this.mapInput().pixels.reduce(
      (acc, current) => `${acc}${current.join('')}\n`,
      ''
    );
}

const solver = new Solver();

console.log('Signal strengths sum -> ', solver.findStrengthsSum());
console.log('Rendered CRT ->\n\n', solver.printPixels());
