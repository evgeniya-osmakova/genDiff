import _ from 'lodash';
import parse from './parsers.js';
import formatDiff from './formatters/index.js';

const makeArrFromChildren = (name, status, children) => {
  const keys = Object.keys(children);
  if (children instanceof Object) {
    return keys.map((key) => (
      { name, status, children: makeArrFromChildren(key, 'unchanged', children[key]) }));
  }
  return [{ name, status, value: children }];
};

const prepareKeys = (beforeValue, afterValue) => {
  const beforeValueKeys = Object.keys(beforeValue);
  const afterValueKeys = Object.keys(afterValue);
  return _.uniq([...beforeValueKeys, ...afterValueKeys]).sort();
};

const makeDiffArr = (keys, beforeData, afterData) => (keys.reduce((acc, key) => {
  if (_.has(beforeData, key) && _.has(afterData, key)) {
    const beforeValue = beforeData[key];
    const afterValue = afterData[key];
    if (beforeValue instanceof Object && afterValue instanceof Object) {
      const allSortedUniqKeys = prepareKeys(beforeValue, afterValue);
      acc.push({
        name: key,
        status: 'unchanged',
        children: makeDiffArr(allSortedUniqKeys, beforeValue, afterValue),
      });
    } else if (beforeValue === afterValue) {
      acc.push(makeArrFromChildren(key, 'unchanged', beforeValue));
    } else {
      acc.push(makeArrFromChildren(key, 'added', afterValue));
      acc.push(makeArrFromChildren(key, 'deleted', beforeValue));
    }
  } else if (_.has(afterData, key)) {
    const afterValue = afterData[key];
    acc.push(makeArrFromChildren(key, 'added', afterValue));
  } else {
    const beforeValue = beforeData[key];
    acc.push(makeArrFromChildren(key, 'deleted', beforeValue));
  }
  return acc.flat();
}, []));


const findDiff = (pathToBeforeFile, pathToAfterFile, format) => {
  const parsedDataBeforeFile = parse(pathToBeforeFile);
  const parsedDataAfterFile = parse(pathToAfterFile);
  const allSortedUniqKeys = prepareKeys(parsedDataBeforeFile, parsedDataAfterFile);
  const diff = makeDiffArr(allSortedUniqKeys, parsedDataBeforeFile, parsedDataAfterFile);
  return formatDiff(diff, format);
};

export default findDiff;
