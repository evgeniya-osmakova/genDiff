import _ from 'lodash';

const mappingNodeType = {
  deleted: (path) => `Property '${path.join('.')}' was deleted`,
  added: (path, node) => {
    const { value } = node;
    const formattedValue = (typeof value === 'string') ? `'${value}'` : value;
    const checkedObjValue = (_.isObject(value)) ? '[complex value]' : formattedValue;
    return `Property '${path.join('.')}' was added with value: ${checkedObjValue}`;
  },
  changed: (path, node) => {
    const { deletedValue, addedValue } = node;
    const formattedDeletedValue = (typeof deletedValue === 'string') ? `'${deletedValue}'` : deletedValue;
    const formattedAddedValue = (typeof addedValue === 'string') ? `'${addedValue}'` : addedValue;
    const checkedObjDelValue = (_.isObject(deletedValue)) ? '[complex value]' : formattedDeletedValue;
    const checkedObjAddValue = (_.isObject(addedValue)) ? '[complex value]' : formattedAddedValue;
    return `Property '${path.join('.')}' was changed from ${checkedObjDelValue} to ${checkedObjAddValue}`;
  },
  nested: (path, node) => {
    const { children } = node;
    const filteredChildren = children.filter(({ status }) => status !== 'unchanged');
    const childrenData = filteredChildren.map((child) => mappingNodeType[child.status]([`${path}.${child.name}`], child));
    return childrenData.join('\n');
  },
};

const formatDiff = (diff) => {
  const filteredDiff = diff.filter(({ status }) => status !== 'unchanged');
  const formattedDiff = filteredDiff.map((elem) => mappingNodeType[elem.status]([elem.name], elem));
  return formattedDiff.join('\n');
};

const makePlainFormat = (diff) => formatDiff(diff);

export default makePlainFormat;
