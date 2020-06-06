import parse from './parsers.js';
import formatDiff from './formatters/index.js';
import makeTree from './makeTree.js';

const findDiff = (pathToBeforeFile, pathToAfterFile, format) => {
  const parsedDataBeforeFile = parse(pathToBeforeFile);
  const parsedDataAfterFile = parse(pathToAfterFile);
  const diff = makeTree(parsedDataBeforeFile, parsedDataAfterFile).flat();
  return formatDiff(diff, format);
};

export default findDiff;
