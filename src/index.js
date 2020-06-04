import _ from 'lodash';
import parse from './parsers.js';
import formatDiff from './formatters/index.js';
import makeTree from './makeTree.js';

const findDiff = (pathToBeforeFile, pathToAfterFile, format) => {
  const parsedDataBeforeFile = parse(pathToBeforeFile);
  const parsedDataAfterFile = parse(pathToAfterFile);
  const beforeValueKeys = Object.keys(parsedDataBeforeFile);
  const afterValueKeys = Object.keys(parsedDataAfterFile);
  const allUniqKeys = _.uniq([...beforeValueKeys, ...afterValueKeys]);
  const allSortedUniqKeys = allUniqKeys.sort();
  const diff = makeTree(allSortedUniqKeys, parsedDataBeforeFile, parsedDataAfterFile).flat();
  return formatDiff(diff, format);
};

export default findDiff;
