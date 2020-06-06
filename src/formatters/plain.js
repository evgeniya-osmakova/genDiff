import _ from 'lodash';

const formDataForAddedNode = (path, node) => {
  const { value } = node;
  const formattedValue = (typeof value === 'string') ? `'${value}'` : value;
  const checkedObjValue = (_.isObject(value)) ? '[complex value]' : formattedValue;
  return `Property '${path.join('.')}' was added with value: ${checkedObjValue}`;
};

const formDataForDeletedNode = (path) => `Property '${path.join('.')}' was deleted`;

const formDataForChangedNode = (path, node) => {
  const { deletedValue, addedValue } = node;
  const formattedDeletedValue = (typeof deletedValue === 'string') ? `'${deletedValue}'` : deletedValue;
  const formattedAddedValue = (typeof addedValue === 'string') ? `'${addedValue}'` : addedValue;
  const checkedObjDelValue = (_.isObject(deletedValue)) ? '[complex value]' : formattedDeletedValue;
  const checkedObjAddValue = (_.isObject(addedValue)) ? '[complex value]' : formattedAddedValue;
  return `Property '${path.join('.')}' was changed from ${checkedObjDelValue} to ${checkedObjAddValue}`;
};

const formDataForWithChildrenNode = (path, node) => {
  const { children } = node;
  const filteredChildren = children.filter(({ status }) => status !== 'unchanged');
  // eslint-disable-next-line no-use-before-define
  const childrenData = filteredChildren.map((child) => chooseNodeType[child.status]([`${path}.${child.name}`], child));
  return childrenData.join('\n');
};

const chooseNodeType = {
  deleted: formDataForDeletedNode,
  added: formDataForAddedNode,
  changed: formDataForChangedNode,
  withChildren: formDataForWithChildrenNode,
};


const formatDiff = (diff) => {
  const filteredDiff = diff.filter(({ status }) => status !== 'unchanged');
  const formattedDiff = filteredDiff.map((elem) => chooseNodeType[elem.status]([elem.name], elem));
  return formattedDiff.join('\n');
};

const makePlainFormat = (diff) => formatDiff(diff);

export default makePlainFormat;
