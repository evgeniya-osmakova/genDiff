import parse from './parsers.js';
import formatDiff from './formatters/index.js';
import makeTree from './makeTree.js';
import prepareData from './prepareData.js';

const findDiff = (pathToBeforeFile, pathToAfterFile, format = 'stylish') => {
  const { dataType: beforeDataType, data: beforeData } = prepareData(pathToBeforeFile);
  const { dataType: afterDataType, data: afterData } = prepareData(pathToAfterFile);
  const parsedBeforeData = parse(beforeData, beforeDataType);
  const parsedAfterData = parse(afterData, afterDataType);
  const diff = makeTree(parsedBeforeData, parsedAfterData);
  return formatDiff(diff, format);
};

export default findDiff;
