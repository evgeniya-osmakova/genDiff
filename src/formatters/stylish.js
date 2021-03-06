import _ from 'lodash';

const firstTab = '  ';

const stringify = (sign, name, value, depth) => {
  const tab = `${firstTab.repeat(depth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  const entries = Object.entries(value);
  // eslint-disable-next-line no-use-before-define
  const formattedValue = entries.map(([key, valueOfKey]) => mapping.unchanged(
    { name: key, value: valueOfKey }, depth + 1,
  ));
  const formattedValueInBrackets = ['{', formattedValue.join('\n'), `${tab}  }`].join('\n');
  return stringify(sign, name, formattedValueInBrackets, depth);
};

const mapping = {
  unchanged: ({ name, value }, depth) => stringify('  ', name, value, depth),
  deleted: ({ name, value }, depth) => stringify('- ', name, value, depth),
  added: ({ name, value }, depth) => stringify('+ ', name, value, depth),
  nested: ({ name, children }, depth, iter) => stringify('  ', name, iter(children, depth + 1), depth),
  changed: ({ name, addedValue, deletedValue }, depth) => {
    const beforeValue = mapping.added({ name, value: addedValue }, depth);
    const afterValue = mapping.deleted({ name, value: deletedValue }, depth);
    return [beforeValue, afterValue];
  },
};

const makeStylishFormat = (diff) => {
  const iter = (innerData, treeDepth) => {
    const formattedDiff = innerData.flatMap((elem) => {
      const { status } = elem;
      return mapping[status](elem, treeDepth, iter);
    });
    const tab = `${firstTab.repeat(treeDepth * 2)}`;
    return ['{', formattedDiff.join('\n'), `${tab}}`].join('\n');
  };
  return iter(diff, 0);
};

export default makeStylishFormat;
