import _ from 'lodash';

const firstTab = '  ';

const relativeTabForChild = `${firstTab.repeat(2)}`;

// eslint-disable-next-line no-use-before-define
const findChildrenData = (children, tab) => `{\n${children.map((child) => chooseNodeType[child.status](child, `${tab}${relativeTabForChild}`))
  .join('\n')}\n${tab}  }`;

const makeStringFromData = (tab, sign, name, value) => `${tab}${sign}${name}: ${value}`;

const unchangedNode = (node, tab) => {
  const { name, value, children } = node;
  if (children) {
    return makeStringFromData(tab, '  ', name, findChildrenData(children, tab));
  }
  return makeStringFromData(tab, '  ', name, value);
};

const changedNode = (node, tab) => {
  const { name, addedValue, deletedValue } = node;
  if (_.isObject(addedValue)) {
    if (_.isObject(deletedValue)) {
      return `${makeStringFromData(tab, '+ ', name, findChildrenData(addedValue, tab))}\n${makeStringFromData(tab, '- ', name, findChildrenData(deletedValue, tab))}`;
    }
    return `${makeStringFromData(tab, '+ ', name, findChildrenData(addedValue, tab))}\n${makeStringFromData(tab, '- ', name, deletedValue)}`;
  }
  if (_.isObject(deletedValue)) {
    return `${makeStringFromData(tab, '+ ', name, addedValue)}\n${makeStringFromData(tab, '- ', name, findChildrenData(deletedValue, tab))}`;
  }
  return `${makeStringFromData(tab, '+ ', name, addedValue)}\n${makeStringFromData(tab, '- ', name, deletedValue)}`;
};

const addedNode = (node, tab) => {
  const { name, value, children } = node;
  if (children) {
    return makeStringFromData(tab, '+ ', name, findChildrenData(children, tab));
  }
  return makeStringFromData(tab, '+ ', name, value);
};

const deletedNode = (node, tab) => {
  const { name, value, children } = node;
  if (children) {
    return makeStringFromData(tab, '- ', name, findChildrenData(children, tab));
  }
  return makeStringFromData(tab, '- ', name, value);
};

const chooseNodeType = {
  unchanged: unchangedNode,
  deleted: deletedNode,
  added: addedNode,
  changed: changedNode,
};

const formatDiff = (diff) => {
  const formattedDiff = diff.map((elem) => chooseNodeType[elem.status](elem, firstTab));
  return formattedDiff.join('\n');
};

const makeStylishFormat = (diff) => `{\n${formatDiff(diff)}\n}`;

export default makeStylishFormat;
