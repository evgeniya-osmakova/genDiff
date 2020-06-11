import _ from 'lodash';

const stringify = (path, node) => {
  if (!node) {
    return `Property '${path.join('.')}' was deleted`;
  }
  const { value, deletedValue, addedValue } = node;
  const formatData = (data) => {
    const formattedData = (typeof data === 'string') ? `'${data}'` : data;
    return (_.isObject(data)) ? '[complex value]' : formattedData;
  };
  if (!_.has(node, 'value')) {
    return `Property '${path.join('.')}' was changed from ${formatData(deletedValue)} to ${formatData(addedValue)}`;
  }
  return `Property '${path.join('.')}' was added with value: ${formatData(value)}`;
};

const mappingNodeType = {
  deleted: (path) => stringify(path),
  added: (path, node) => stringify(path, node),
  changed: (path, node) => stringify(path, node),
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
