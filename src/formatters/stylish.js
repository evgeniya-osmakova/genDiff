import _ from 'lodash';

const firstTab = '  ';

const relativeTabForChild = `${firstTab.repeat(2)}`;

const stringify = (tab, sign, name, value) => {
  if (Array.isArray(value)) {
    // eslint-disable-next-line no-use-before-define
    return `${tab}${sign}${name}: {\n${value.map((child) => mappingNodeType[child.status](child,
      `${tab}${relativeTabForChild}`))
      .join('\n')}\n${tab}  }`;
  }
  if (_.isObject(value)) {
    const keys = _.keys(value);
    const arrFromObj = keys.map((key) => {
      const objValue = value[key];
      if (_.isObject(objValue)) {
        return `${tab}${relativeTabForChild}  ${key}: {\n${stringify(objValue,
          `${tab}${relativeTabForChild}`)}\n${tab}${relativeTabForChild}  }`;
      }
      return `${tab}${relativeTabForChild}  ${key}: ${objValue}`;
    });
    return `${tab}${sign}${name}: {\n${arrFromObj.join('\n')}\n${tab}  }`;
  }
  return `${tab}${sign}${name}: ${value}`;
};


const mappingNodeType = {
  unchanged: ({ name, value }, tab) => stringify(tab, '  ', name, value),
  deleted: ({ name, value }, tab) => stringify(tab, '- ', name, value),
  added: ({ name, value }, tab) => stringify(tab, '+ ', name, value),
  nested: ({ name, children }, tab) => `${stringify(tab, '  ', name, children)}`,
  changed: (node, tab) => {
    const { name, addedValue, deletedValue } = node;
    return `${mappingNodeType.added({ name, value: addedValue },
      tab)}\n${mappingNodeType.deleted({ name, value: deletedValue }, tab)}`;
  },
};


const formatDiff = (diff) => {
  const formattedDiff = diff.map((elem) => mappingNodeType[elem.status](elem, firstTab));
  return formattedDiff.join('\n');
};

const makeStylishFormat = (diff) => `{\n${formatDiff(diff)}\n}`;

export default makeStylishFormat;
