import _ from 'lodash';

const stringify = (value) => {
  const formattedData = (typeof value === 'string') ? `'${value}'` : value;
  return (_.isObject(value)) ? '[complex value]' : formattedData;
};

const mappingNodeType = {
  deleted: (path) => `Property '${path.join('.')}' was deleted`,
  added: (path, { value }) => `Property '${path.join('.')}' was added with value: ${stringify(value)}`,
  changed: (path, node) => {
    const { addedValue, deletedValue } = node;
    return `Property '${path.join('.')}' was changed from ${stringify(deletedValue)} to ${stringify(addedValue)}`;
  },
  nested: (path, node) => {
    const { children } = node;
    const childrenData = children.map((child) => mappingNodeType[child.status]([`${path}.${child.name}`], child));
    const filteredChildrenData = childrenData.filter((elem) => elem !== null);
    return filteredChildrenData.join('\n');
  },
  unchanged: () => null,
};

const makePlainFormat = (diff) => {
  const formattedDiff = diff.map((elem) => mappingNodeType[elem.status]([elem.name], elem));
  const filteredFormattedDif = formattedDiff.filter((elem) => elem !== null);
  return filteredFormattedDif.join('\n');
};

export default makePlainFormat;
