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

const stringify = (sign, name, value, depth) => {
  const tab = `${firstTab.repeat(depth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  // eslint-disable-next-line no-use-before-define
  return stringify(sign, name, iter(makeAST(value), depth + 1), depth);
};

const mappingNodeType = {
  unchanged: ({ name, value }, depth) => stringify('  ', name, value, depth),
  deleted: ({ name, value }, depth) => stringify('- ', name, value, depth),
  added: ({ name, value }, depth) => stringify('+ ', name, value, depth),
  // eslint-disable-next-line no-use-before-define
  nested: ({ name, children }, depth) => stringify('  ', name, iter(children, depth + 1), depth),
  changed: (node, depth) => {
    const { name, addedValue, deletedValue } = node;
    const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, depth);
    const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, depth);
    return [strFromAddedValue, strFromDeletedValue];
  },
};

const iter = (innerData, treeDepth) => {
  const formattedDiff = innerData.flatMap((elem) => {
    const { status } = elem;
    return mappingNodeType[status](elem, treeDepth);
  });
  const tab = `${firstTab.repeat(treeDepth * 2)}`;
  return ['{', formattedDiff.join('\n'), `${tab}}`].join('\n');
};

const makeStylishFormat = (diff) => iter(diff, 0);

export default makeStylishFormat;
