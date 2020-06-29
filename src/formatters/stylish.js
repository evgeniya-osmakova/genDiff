import _ from 'lodash';

const firstTab = '  ';

const stringify = (sign, name, value, depth) => {
  const tab = `${firstTab.repeat(depth * 2 + 1)}`;
  if (!_.isObject(value)) {
    return `${tab}${sign}${name}: ${value}`;
  }
  const keys = _.keys(value);
  // eslint-disable-next-line no-use-before-define
  const arrFromObj = keys.map((key) => mappingNodeType.unchanged(
    { name: key, value: value[key] }, depth + 1,
  ));
  const formattedValue = ['{', arrFromObj, `${tab}  }`].flat().join('\n');
  return stringify(sign, name, formattedValue, depth);
};

const mappingNodeType = {
  unchanged: ({ name, value }, depth) => stringify('  ', name, value, depth),
  deleted: ({ name, value }, depth) => stringify('- ', name, value, depth),
  added: ({ name, value }, depth) => stringify('+ ', name, value, depth),
  nested: ({ name, children }, depth, fn) => stringify('  ', name, fn(children, depth + 1), depth),
  changed: ({ name, addedValue, deletedValue }, depth) => {
    const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, depth);
    const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, depth);
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
