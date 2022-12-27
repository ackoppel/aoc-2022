import { input } from './input.js';

class Solver {
  detectMarker = (fromIndex, distinctChars) =>
    Object.values(
      Array.from({ length: distinctChars }).reduce((acc, current, index) => {
        acc[input[fromIndex - index]] = true;
        return acc;
      }, {})
    ).length === distinctChars;

  findMarker = (distinctChars) => {
    for (let i = distinctChars - 1; i < input.length; i++) {
      const isStart = this.detectMarker(i, distinctChars);
      if (isStart) {
        return i + 1;
      }
    }
  };

  findFirstPacketMarker = () => this.findMarker(4);

  findFirstMessageMarker = () => this.findMarker(14);
}

const solver = new Solver();

console.log('Find first packet marker --> ', solver.findFirstPacketMarker());
console.log('Find first message marker --> ', solver.findFirstMessageMarker());
