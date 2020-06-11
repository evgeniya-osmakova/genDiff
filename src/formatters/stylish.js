import _ from 'lodash';

const firstTab = '  ';

const relativeTabForChild = `${firstTab.repeat(2)}`;

const stringify = (tab, sign, name, value) => {
  if (_.isObject(value)) {
    const childTab = `${tab}${relativeTabForChild}`;
    const keys = _.keys(value);
    const arrFromObj = keys.map((key) => {
      const objValue = value[key];
      return stringify(childTab, '  ', key, objValue);
    });
    return `${tab}${sign}${name}: {\n${arrFromObj.join('\n')}\n${tab}  }`;
  }
  return `${tab}${sign}${name}: ${value}`;
};


const mappingNodeType = {
  unchanged: ({ name, value }, tab) => stringify(tab, '  ', name, value),
  deleted: ({ name, value }, tab) => stringify(tab, '- ', name, value),
  added: ({ name, value }, tab) => stringify(tab, '+ ', name, value),
  nested: ({ name, children }, tab) => {
    const value = `{\n${children.map((child) => mappingNodeType[child.status](child,
      `${tab}${relativeTabForChild}`))
      .join('\n')}\n${tab}  }`;
    return stringify(tab, '  ', name, value);
  },
  changed: (node, tab) => {
    const { name, addedValue, deletedValue } = node;
    return `${mappingNodeType.added({ name, value: addedValue },
      tab)}\n${mappingNodeType.deleted({ name, value: deletedValue }, tab)}`;
  },
};

const makeStylishFormat = (diff) => {
  const formattedDiff = diff.map((elem) => mappingNodeType[elem.status](elem, firstTab));
  console.log(`{\n${formattedDiff.join('\n')}\n}`);
  return `{\n${formattedDiff.join('\n')}\n}`;
};

export default makeStylishFormat;
