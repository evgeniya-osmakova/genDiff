import _ from 'lodash';

const makeTree = (beforeData, afterData) => {
  const allKeys = _.union(_.keys(beforeData), _.keys(afterData));
  const allSortedUniqKeys = _.uniq(allKeys).sort();
  return allSortedUniqKeys.map((key) => {
    const beforeValue = beforeData[key];
    const afterValue = afterData[key];
    if (_.has(afterData, key) && _.has(beforeData, key)) {
      if (_.isObject(beforeValue) && _.isObject(afterValue)) {
        return {
          name: key,
          status: 'withChildren',
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
    }
    if (_.has(afterData, key)) {
      return { name: key, status: 'added', value: afterValue };
    }
    return { name: key, status: 'deleted', value: beforeValue };
  });
};

export default makeTree;
