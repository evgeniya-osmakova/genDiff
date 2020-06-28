import _ from 'lodash';

const firstTab = '  ';

const makeAST = (data) => {
  const keys = _.keys(data);
  return keys.map((key) => {
    const value = data[key];
    return (_.isObject(value))
      ? {
        name: key,
        status: 'unchanged',
        children: makeAST(value),
      }
      : { name: key, status: 'unchanged', value };
  });
};

const stringify = (sign, name, value, depth, status) => {
  const tab = `${firstTab.repeat(depth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  const formattedValue = (status === 'nested') ? value : makeAST(value);
  const result = [
    stringify(sign, name, '{', depth),
    // eslint-disable-next-line no-use-before-define
    iter(formattedValue, depth + 1),
    `${tab}  }`,
  ];
  return result.join('\n');
};

const mappingNodeType = {
  unchanged: ({ name, value }, depth) => stringify('  ', name, value, depth),
  deleted: ({ name, value }, depth) => stringify('- ', name, value, depth),
  added: ({ name, value }, depth) => stringify('+ ', name, value, depth),
  nested: ({ name, children, status }, depth) => stringify('  ', name, children, depth, status),
  changed: (node, depth) => {
    const { name, addedValue, deletedValue } = node;
    const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, depth);
    const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, depth);
    return [strFromAddedValue, strFromDeletedValue];
  },
};

const iter = (innerData, treeDepth) => {
  const formattedDiff = innerData.flatMap((elem) => mappingNodeType[elem.status](elem,
    treeDepth, elem.status));
  return formattedDiff.join('\n');
};

const makeStylishFormat = (diff) => ['{', iter(diff, 0), '}'].join('\n');

export default makeStylishFormat;
