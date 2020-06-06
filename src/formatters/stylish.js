import _ from 'lodash';

const firstTab = '  ';

const relativeTabForChild = `${firstTab.repeat(2)}`;

// eslint-disable-next-line no-use-before-define
const findChildrenData = (children, tab) => `{\n${children.map((child) => chooseNodeType[child.status](child,
  `${tab}${relativeTabForChild}`))
  .join('\n')}\n${tab}  }`;

const makeStringFromData = (tab, sign, name, value) => `${tab}${sign}${name}: ${value}`;

const makeStringFromObj = (obj, tab) => {
  const keys = _.keys(obj);
  const arrFromObj = keys.map((key) => {
    const value = obj[key];
    if (_.isObject(value)) {
      return `${tab}${relativeTabForChild}  ${key}: {\n${makeStringFromObj(value,
        `${tab}${relativeTabForChild}`)}\n${tab}${relativeTabForChild}  }`;
    }
    return `${tab}${relativeTabForChild}  ${key}: ${value}`;
  });
  return arrFromObj.join('\n');
};

const formDataForUnchangedNode = ({ name, value }, tab) => makeStringFromData(tab, '  ', name, value);

const formDataForAddedNode = ({ name, value }, tab) => {
  if (_.isObject(value)) {
    return `${makeStringFromData(tab, '+ ', name, '{')}\n${makeStringFromObj(value, tab)}\n${tab}  }`;
  }
  return makeStringFromData(tab, '+ ', name, value);
};

const formDataForDeletedNode = ({ name, value }, tab) => {
  if (_.isObject(value)) {
    return `${makeStringFromData(tab, '- ', name, '{')}\n${makeStringFromObj(value, tab)}\n${tab}  }`;
  }
  return makeStringFromData(tab, '- ', name, value);
};

const formDataForChangedNode = (node, tab) => {
  const { name, addedValue, deletedValue } = node;
  return `${formDataForAddedNode({ name, value: addedValue },
    tab)}\n${formDataForDeletedNode({ name, value: deletedValue }, tab)}`;
};

const formDataForWithChildrenNode = ({ name, children }, tab) => `${makeStringFromData(tab, '  ',
  name, findChildrenData(children, tab))}`;


const chooseNodeType = {
  unchanged: formDataForUnchangedNode,
  deleted: formDataForDeletedNode,
  added: formDataForAddedNode,
  changed: formDataForChangedNode,
  withChildren: formDataForWithChildrenNode,
};


const formatDiff = (diff) => {
  const formattedDiff = diff.map((elem) => chooseNodeType[elem.status](elem, firstTab));
  return formattedDiff.join('\n');
};

const makeStylishFormat = (diff) => `{\n${formatDiff(diff)}\n}`;

export default makeStylishFormat;
