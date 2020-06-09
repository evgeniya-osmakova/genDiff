import parse from './parsers.js';
import formatDiff from './formatters/index.js';
import makeTree from './makeTree.js';
import prepareData from './prepairingData.js';

const findDiff = (pathToBeforeFile, pathToAfterFile, format = 'stylish') => {
  const { dataType: dataTypeBeforeFile, data: beforeFileData } = prepareData(pathToBeforeFile);
  const { dataType: dataTypeAfterFile, data: afterFileData } = prepareData(pathToAfterFile);
  const parsedBeforeData = parse(beforeFileData, dataTypeBeforeFile);
  const parsedAfterData = parse(afterFileData, dataTypeAfterFile);
  const diff = makeTree(parsedBeforeData, parsedAfterData);
  return formatDiff(diff, format);
};

export default findDiff;
