import { input } from './input.js';

class Solver {
  CommandOutputStart = '$';

  Command = {
    changeDir: 'cd',
    list: 'ls',
  };

  // Movement options if no dir name included
  DirOptions = {
    Root: '/',
    Back: '..',
  };

  // Root node
  folderTree = {
    name: '',
    size: 0,
    isRoot: true,
    children: [],
  };

  totalSpace = 70000000;
  requiredSpaceForUpdate = 30000000;

  constructor() {
    this.generateTree();
  }

  parseInput = () => input.split(this.CommandOutputStart);

  /** @notice Part I */
  findDirsUnderThresholdSizeSum = (limit) =>
    this.getAllFolderSizes().reduce(
      (acc, current) => (current < limit ? acc + current : acc),
      0
    );

  /** @notice Part II */
  findSmallestDirToDelete = () => {
    const freeSpace = this.totalSpace - this.findFolderSize(this.folderTree);
    const spaceRequired = this.requiredSpaceForUpdate - freeSpace;
    return this.getAllFolderSizes()
      .sort((a, b) => a - b)
      .find((size) => size >= spaceRequired);
  };

  findFolderSize = (folder) =>
    folder.children.reduce((acc, current) => {
      const size = current.children.length
        ? this.findFolderSize(current)
        : current.size;
      return acc + size;
    }, 0);

  getAllFolderSizes = () =>
    this.getFlatTreeWithChildren([this.folderTree])
      .filter((node) => node.children.length)
      .map((folder) => this.findFolderSize(folder));

  getFlatTreeWithChildren = (list) =>
    list.reduce(
      (acc, current) => [
        ...acc,
        current,
        ...(current.children.length
          ? this.getFlatTreeWithChildren(current.children)
          : []),
      ],
      []
    );

  generateTree = () => {
    const terminalOutput = this.parseInput();
    terminalOutput.reduce(this.handleCommand, this.folderTree);
    this.cleanNodeParents(this.folderTree);
  };

  handleCommand = (currentPointer, commandOutput) => {
    const trimmed = commandOutput.trim();
    const commandParts = trimmed.split('\n');

    if (trimmed.startsWith(this.Command.changeDir)) {
      const [, directory] = commandParts[0].split(' ');
      if (directory === this.DirOptions.Root) {
        return this.folderTree;
      } else if (directory === this.DirOptions.Back) {
        return currentPointer.parent;
      } else {
        const existingChild = currentPointer.children.find(
          (node) => node.name === directory
        );
        return existingChild
          ? existingChild
          : {
              name: directory,
              parent: currentPointer,
              children: [],
            };
      }
    } else {
      if (!currentPointer.children.length) {
        for (let i = 1; i < commandParts.length; i++) {
          const [prefix, name] = commandParts[i].split(' ');
          currentPointer.children.push({
            name,
            parent: currentPointer,
            size: parseInt(prefix, 10) || 0,
            children: [],
          });
        }
      }
      return currentPointer;
    }
  };

  cleanNodeParents = (parent) => {
    parent.children.forEach((child) => {
      this.cleanNodeParents(child);
      delete child.parent;
    });
    delete parent.parent;
    return parent;
  };
}

const solver = new Solver();

console.log(
  'Total sum of folders under threshold -> ',
  solver.findDirsUnderThresholdSizeSum(100000)
);

console.log(
  'Total size of smallest dir to delete -> ',
  solver.findSmallestDirToDelete()
);
