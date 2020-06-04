import _ from 'lodash';

const makeTree = (keys, beforeData, afterData) => (keys.map((key) => {
  const beforeValue = beforeData[key];
  const afterValue = afterData[key];
  if (Object.keys(afterData).length === 0) {
    if (_.isObject(beforeValue)) {
      return {
        name: key,
        status: 'unchanged',
        children: makeTree(Object.keys(beforeValue), beforeValue, {}).flat(),
      };
    }
    return { name: key, status: 'unchanged', value: beforeValue };
  }
  if (_.isObject(beforeValue) && !_.isObject(afterValue)) {
    if (!_.has(afterData, key)) {
      return {
        name: key,
        status: 'deleted',
        children: makeTree(Object.keys(beforeValue), beforeValue, {}).flat(),
      };
    }
    return {
      name: key,
      status: 'changed',
      addedValue: afterValue,
      deletedValue: makeTree(Object.keys(beforeValue), beforeValue, {}).flat(),
    };
  }
  if (!_.isObject(beforeValue) && _.isObject(afterValue)) {
    if (_.has(beforeData, key)) {
      return {
        name: key,
        status: 'changed',
        addedValue: makeTree(Object.keys(afterValue), afterValue, {}).flat(),
        deletedValue: beforeValue,
      };
    }
    return {
      name: key,
      status: 'added',
      children: makeTree(Object.keys(afterValue), afterValue, {}).flat(),
    };
  }
  if (_.isObject(beforeValue) && _.isObject(afterValue)) {
    const beforeValueKeys = Object.keys(beforeValue);
    const afterValueKeys = Object.keys(afterValue);
    const allUniqKeys = _.uniq([...beforeValueKeys, ...afterValueKeys]);
    const allSortedUniqKeys = allUniqKeys.sort();
    return {
      name: key,
      status: 'unchanged',
      children: makeTree(allSortedUniqKeys, beforeValue, afterValue).flat(),
    };
  }
  if (beforeValue === afterValue) {
    return { name: key, status: 'unchanged', value: beforeValue };
  }
  if (_.has(afterData, key) && _.has(beforeData, key)) {
    return {
      name: key,
      status: 'changed',
      deletedValue: beforeValue,
      addedValue: afterValue,
    };
  }
  if (_.has(afterData, key)) {
    return { name: key, status: 'added', value: afterValue };
  }
  return { name: key, status: 'deleted', value: beforeValue };
}));

export default makeTree;
