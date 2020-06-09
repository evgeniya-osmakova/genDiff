import _ from 'lodash';

const makeTree = (beforeData, afterData) => {
  const allKeys = _.union(_.keys(beforeData), _.keys(afterData));
  const allSortedUniqKeys = _.uniq(allKeys).sort();
  return allSortedUniqKeys.map((key) => {
    const beforeValue = beforeData[key];
    const afterValue = afterData[key];
    if (_.has(afterData, key) && !_.has(beforeData, key)) {
      return { name: key, status: 'added', value: afterValue };
    }
    if (_.has(beforeData, key) && !_.has(afterData, key)) {
      return { name: key, status: 'deleted', value: beforeValue };
    }
    if (_.isObject(beforeValue) && _.isObject(afterValue)) {
      return {
        name: key,
        status: 'nested',
        children: makeTree(beforeValue, afterValue).flat(),
      };
    }
    if (beforeValue === afterValue) {
      return { name: key, status: 'unchanged', value: beforeValue };
    }
    return {
      name: key,
      status: 'changed',
      addedValue: afterValue,
      deletedValue: beforeValue,
    };
  });
};

export default makeTree;
