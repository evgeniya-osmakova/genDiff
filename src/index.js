import _ from 'lodash';
import parse from './parsers.js';
import formatDiff from './formatters/index.js';

const makeArrFromChildren = (elem) => {
  if (elem instanceof Object) {
    const keys = Object.keys(elem);
    return keys.map((key) => ({ name: key, status: 'unchanged', value: makeArrFromChildren(elem[key]) }));
  }
  return [elem];
};

const prepareKeys = (beforeValue, afterValue) => {
  const beforeValueKeys = Object.keys(beforeValue);
  const afterValueKeys = Object.keys(afterValue);
  const allSortedUniqKeys = _.uniq([...beforeValueKeys, ...afterValueKeys]).sort();
  return allSortedUniqKeys;
};

const makeDiffArr = (keys, beforeData, afterData) => {
  const diff = [];
  keys.forEach((key) => {
    if (_.has(beforeData, key) && _.has(afterData, key)) {
      const beforeValue = beforeData[key];
      const afterValue = afterData[key];
      if (beforeValue instanceof Object && afterValue instanceof Object) {
        const allSortedUniqKeys = prepareKeys(beforeValue, afterValue);
        diff.push({
          name: key,
          status: 'unchanged',
          value: makeDiffArr(allSortedUniqKeys, beforeValue, afterValue),
        });
      } else if (beforeValue === afterValue) {
        diff.push({ name: key, status: 'unchanged', value: makeArrFromChildren(beforeValue) });
      } else {
        diff.push({ name: key, status: 'added', value: makeArrFromChildren(afterValue) });
        diff.push({ name: key, status: 'deleted', value: makeArrFromChildren(beforeValue) });
      }
    } else if (_.has(afterData, key)) {
      const afterValue = afterData[key];
      diff.push({ name: key, status: 'added', value: makeArrFromChildren(afterValue) });
    } else {
      const beforeValue = beforeData[key];
      diff.push({ name: key, status: 'deleted', value: makeArrFromChildren(beforeValue) });
    }
  });
  return diff;
};

const findDiff = (pathToBeforeFile, pathToAfterFile, format) => {
  const parsedDataBeforeFile = parse(pathToBeforeFile);
  const parsedDataAfterFile = parse(pathToAfterFile);
  const allSortedUniqKeys = prepareKeys(parsedDataBeforeFile, parsedDataAfterFile);
  const diff = makeDiffArr(allSortedUniqKeys, parsedDataBeforeFile, parsedDataAfterFile);
  return formatDiff(diff, format);
};

export default findDiff;
