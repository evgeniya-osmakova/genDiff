import _ from 'lodash';

const firstTab = '  ';

const stringify = (sign, name, value, treeDepth) => {
  const tab = `${firstTab.repeat(treeDepth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  const a = (Array.isArray(value))
    // eslint-disable-next-line no-use-before-define
    ? value.map((child) => mappingNodeType[child.status](child, treeDepth + 1))
    : _.keys(value).map((key) => stringify('  ', key, value[key], treeDepth + 1));
  const result = [
    stringify(sign, name, '{', treeDepth),
    a.join('\n'),
    `${tab}  }`,
  ];
  return result.join('\n');
};

const mappingNodeType = {
  unchanged: ({ name, value }, treeDepth) => stringify('  ', name, value, treeDepth),
  deleted: ({ name, value }, treeDepth) => stringify('- ', name, value, treeDepth),
  added: ({ name, value }, treeDepth) => stringify('+ ', name, value, treeDepth),
  nested: ({ name, children }, treeDepth) => stringify('  ', name, children, treeDepth),
  changed: (node, treeDepth) => {
    const { name, addedValue, deletedValue } = node;
    const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, treeDepth);
    const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, treeDepth);
    return [strFromAddedValue, strFromDeletedValue].join('\n');
  },
};

const makeStylishFormat = (diff) => {
  const formattedDiff = diff.map((elem) => mappingNodeType[elem.status](elem, 0));
  return `{\n${formattedDiff.join('\n')}\n}`;
};

export default makeStylishFormat;
