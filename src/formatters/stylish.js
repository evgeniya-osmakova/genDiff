import _ from 'lodash';

const firstTab = '  ';

const makeAST = (data) => {
  const keys = _.keys(data);
  return keys.map((key) => {
    const value = data[key];
    return (_.isObject(value))
      ? {
        name: key,
        status: 'nested',
        children: makeAST(value),
      }
      : { name: key, status: 'unchanged', value };
  });
};

const stringify = (sign, name, value, depth, fn) => {
  const tab = `${firstTab.repeat(depth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  // eslint-disable-next-line no-use-before-define
  return mappingNodeType.nested({ name, children: makeAST(value) }, depth, fn, sign);
};

const mappingNodeType = {
  unchanged: ({ name, value }, depth, fn) => stringify('  ', name, value, depth, fn),
  deleted: ({ name, value }, depth, fn) => stringify('- ', name, value, depth, fn),
  added: ({ name, value }, depth, fn) => stringify('+ ', name, value, depth, fn),
  nested: ({ name, children }, depth, fn, sign = '  ') => stringify(sign, name, fn(children, depth + 1), depth, fn),
  changed: ({ name, addedValue, deletedValue }, depth, fn) => {
    const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, depth, fn);
    const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, depth, fn);
    return [strFromAddedValue, strFromDeletedValue];
  },
};

const makeStylishFormat = (diff) => {
  const iter = (innerData, treeDepth) => {
    const formattedDiff = innerData.flatMap((elem) => {
      const { status } = elem;
      return mappingNodeType[status](elem, treeDepth, iter);
    });
    const tab = `${firstTab.repeat(treeDepth * 2)}`;
    return ['{', formattedDiff, `${tab}}`].flat().join('\n');
  };
  return iter(diff, 0);
};

export default makeStylishFormat;
