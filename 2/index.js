import { input } from './input.js';

class Solver {
  options = {
    rock: 1,
    paper: 2,
    scissors: 3,
  };
  outcomeScore = {
    lose: 0,
    draw: 3,
    win: 6,
  };
  opponentOptions = {
    A: this.options.rock,
    B: this.options.paper,
    C: this.options.scissors,
  };
  myOptions = {
    X: this.options.rock,
    Y: this.options.paper,
    Z: this.options.scissors,
  };
  elfHint = {
    X: this.outcomeScore.lose,
    Y: this.outcomeScore.draw,
    Z: this.outcomeScore.win,
  };

  parseInput = () => input.split('\n');

  findMyTotalScore = () =>
    this.parseInput().reduce((acc, current) => {
      const opponentChoice = this.opponentOptions[current[0]];
      const myChoice = this.myOptions[current[2]];
      // add choice to total
      acc += myChoice;
      // draw
      if (opponentChoice === myChoice) {
        acc += this.outcomeScore.draw;
      } else if (
        (myChoice === this.options.rock &&
          opponentChoice === this.options.scissors) ||
        (myChoice === this.options.paper &&
          opponentChoice === this.options.rock) ||
        (myChoice === this.options.scissors &&
          opponentChoice === this.options.paper)
      ) {
        acc += this.outcomeScore.win;
      } else {
        acc += this.outcomeScore.lose;
      }
      return acc;
    }, 0);

  findMyTotalScoreWithStrategy = () =>
    this.parseInput().reduce((acc, current) => {
      const opponentChoice = this.opponentOptions[current[0]];
      const outcome = this.elfHint[current[2]];
      // add outcome to total
      acc += outcome;
      if (outcome === this.outcomeScore.draw) {
        acc += opponentChoice;
      } else if (outcome === this.outcomeScore.win) {
        if (opponentChoice === this.options.rock) {
          acc += this.options.paper;
        } else if (opponentChoice === this.options.paper) {
          acc += this.options.scissors;
        } else {
          acc += this.options.rock;
        }
      } else {
        if (opponentChoice === this.options.rock) {
          acc += this.options.scissors;
        } else if (opponentChoice === this.options.paper) {
          acc += this.options.rock;
        } else {
          acc += this.options.paper;
        }
      }

      return acc;
    }, 0);
}

const solver = new Solver();

console.log('Total score -> ', solver.findMyTotalScore()); // 13565
console.log(
  'Total score w/ strategy -> ',
  solver.findMyTotalScoreWithStrategy()
); // 12424
