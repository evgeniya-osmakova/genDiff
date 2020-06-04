import _ from 'lodash';

const unchangedNode = (path, node) => {
  const { children } = node;
  if (children) {
    // eslint-disable-next-line no-use-before-define
    const childrenData = children.map((child) => chooseNodeType[child.status]([`${path}.${child.name}`], child));
    const filteredChildrenData = childrenData.filter((elem) => elem.length > 0);
    return filteredChildrenData.join('\n');
  }
  return '';
};

const addedNode = (path, node) => {
  const { value, children } = node;
  const formattedValue = (typeof value === 'string') ? `'${value}'` : value;
  const checkedObjValue = (children) ? '[complex value]' : formattedValue;
  return `Property '${path.join('.')}' was added with value: ${checkedObjValue}`;
};

const deletedNode = (path) => `Property '${path.join('.')}' was deleted`;

const changedNode = (path, node) => {
  const { deletedValue, addedValue } = node;
  const formattedDeletedValue = (typeof deletedValue === 'string') ? `'${deletedValue}'` : deletedValue;
  const formattedAddedValue = (typeof addedValue === 'string') ? `'${addedValue}'` : addedValue;
  const checkedObjDelValue = (_.isObject(deletedValue)) ? '[complex value]' : formattedDeletedValue;
  const checkedObjAddValue = (_.isObject(addedValue)) ? '[complex value]' : formattedAddedValue;
  return `Property '${path.join('.')}' was changed from ${checkedObjDelValue} to ${checkedObjAddValue}`;
};

const chooseNodeType = {
  unchanged: unchangedNode,
  deleted: deletedNode,
  added: addedNode,
  changed: changedNode,
};

const formatDiff = (diff) => {
  const formattedDiff = diff.map((elem) => chooseNodeType[elem.status]([elem.name], elem));
  const filteredFormattedDiff = formattedDiff.filter((elem) => elem.length > 0);
  return filteredFormattedDiff.join('\n');
};

const makePlainFormat = (diff) => formatDiff(diff);

export default makePlainFormat;
