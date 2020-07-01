import _ from 'lodash';

const stringify = (value) => {
  const formattedData = (typeof value === 'string') ? `'${value}'` : value;
  return (_.isObject(value)) ? '[complex value]' : formattedData;
};

const mapping = {
  deleted: (path) => `Property '${path.join('.')}' was deleted`,
  added: (path, { value }) => `Property '${path.join('.')}' was added with value: ${stringify(value)}`,
  changed: (path, node) => {
    const { addedValue, deletedValue } = node;
    return `Property '${path.join('.')}' was changed from ${stringify(deletedValue)} to ${stringify(addedValue)}`;
  },
  nested: (path, node, iter) => {
    const { children } = node;
    return iter(children, path);
  },
  unchanged: () => [],
};

const makePlainFormat = (diff) => {
  const iter = (innerData, elemPath) => {
    const formattedDiff = innerData.flatMap(
      (elem) => mapping[elem.status]([...elemPath, elem.name], elem, iter),
    );
    return formattedDiff.join('\n');
  };
  return iter(diff, '');
};

export default makePlainFormat;
