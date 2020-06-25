import _ from 'lodash';

const firstTab = '  ';

const makeStylishFormat = (diff) => {
  const iter = (innerData, treeDepth) => {
    const stringify = (sign, name, value, depth) => {
      const tab = `${firstTab.repeat(depth * 2 + 1)}`;
      if (!_.isObject(value)) {
        return `${tab}${sign}${name}: ${value}`;
      }
      const result = [
        stringify(sign, name, '{', depth),
        iter([value].flat(), depth + 1),
        `${tab}  }`,
      ];
      return result.join('\n');
    };

    const mappingNodeType = {
      unchanged: ({ name, value }, depth) => stringify('  ', name, value, depth),
      deleted: ({ name, value }, depth) => stringify('- ', name, value, depth),
      added: ({ name, value }, depth) => stringify('+ ', name, value, depth),
      nested: ({ name, children }, depth) => stringify('  ', name, children, depth),
      changed: (node, depth) => {
        const { name, addedValue, deletedValue } = node;
        const strFromAddedValue = mappingNodeType.added({ name, value: addedValue }, depth);
        const strFromDeletedValue = mappingNodeType.deleted({ name, value: deletedValue }, depth);
        return [strFromAddedValue, strFromDeletedValue];
      },
    };

    const formattedDiff = innerData.flatMap((elem) => {
      if (!_.has(elem, 'status')) {
        const name = _.keys(elem)[0];
        const value = elem[name];
        return mappingNodeType.unchanged({ name, value }, treeDepth);
      }
      return mappingNodeType[elem.status](elem, treeDepth);
    });
    const strFromFormattedDiff = formattedDiff.join('\n');
    const resultArr = (treeDepth === 0) ? ['{', strFromFormattedDiff, '}'] : formattedDiff;
    return resultArr.join('\n');
  };
  return iter(diff, 0);
};

export default makeStylishFormat;
