import parse from './parsers.js';
import formatDiff from './formatters/index.js';
import makingTree from './makingTree.js';
import prepareData from './prepairingData.js';

const findDiff = (pathToBeforeFile, pathToAfterFile, format) => {
  const { extname: extnameBeforeFile, data: beforeFileData } = prepareData(pathToBeforeFile);
  const { extname: extnameAfterFile, data: afterFileData } = prepareData(pathToAfterFile);
  const parsedDataBeforeFile = parse(beforeFileData, extnameBeforeFile);
  const parsedDataAfterFile = parse(afterFileData, extnameAfterFile);
  const diff = makingTree(parsedDataBeforeFile, parsedDataAfterFile).flat();
  return formatDiff(diff, format);
};

export default findDiff;
