import { input } from './input.js';

class Solver {
  parseInput = () => input.split('\n');

  getPriorityScore = (char) => {
    const score = this.getAlphabeticalIndex(char);
    return score > 0
      ? score // lowercase
      : this.getAlphabeticalIndex(char.toLowerCase()) + 26; // uppercase
  };
  getAlphabeticalIndex = (char) => char.charCodeAt(0) - 96;

  findPrioritySum = () =>
    this.parseInput().reduce((acc, current) => {
      const rucksack = current.split('');
      const splitLength = rucksack.length / 2;

      const firstHalf = rucksack.slice(0, splitLength);
      const secondHalf = rucksack.slice(splitLength);
      const repeatingChar = firstHalf.find((fhc) =>
        secondHalf.some((shc) => fhc === shc)
      );

      if (repeatingChar) {
        acc += this.getPriorityScore(repeatingChar);
      }

      return acc;
    }, 0);

  findGroupBadgePrioritySum = () => {
    let groupBadgePrioritySum = 0;
    const parsedInput = this.parseInput();
    for (let i = 0; i < parsedInput.length - 1; i += 3) {
      const group = [
        parsedInput[i].split(''),
        parsedInput[i + 1].split(''),
        parsedInput[i + 2].split(''),
      ];
      const repeatingChar = group[0].find((firstGroupChar) =>
        group[1].some(
          (secondGroupChar) =>
            secondGroupChar === firstGroupChar &&
            group[2].some(
              (thirdGroupChar) => thirdGroupChar === secondGroupChar
            )
        )
      );
      if (repeatingChar) {
        groupBadgePrioritySum += this.getPriorityScore(repeatingChar);
      }
    }
    return groupBadgePrioritySum;
  };
}

const solver = new Solver();

console.log('Priority score sum -> ', solver.findPrioritySum());
console.log(
  'Group Badge Priority score sum -> ',
  solver.findGroupBadgePrioritySum()
);
