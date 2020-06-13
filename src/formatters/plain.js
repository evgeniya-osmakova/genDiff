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
    const filteredChildren = children.filter(({ status }) => status !== 'unchanged');
    const childrenData = filteredChildren.map((child) => mappingNodeType[child.status]([`${path}.${child.name}`], child));
    return childrenData.join('\n');
  },
};

const makePlainFormat = (diff) => {
  const filteredDiff = diff.filter(({ status }) => status !== 'unchanged');
  const formattedDiff = filteredDiff.map((elem) => mappingNodeType[elem.status]([elem.name], elem));
  return formattedDiff.join('\n');
};

export default makePlainFormat;
