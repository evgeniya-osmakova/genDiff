const actionList = {
  deleted: 'was deleted',
  added: 'was added with value: ',
  changed: 'was changed ',
};

const formStringFromObject = (key, value, action) => `Property '${key}' ${action}${value}`;

const formResultArr = (preparatoryArr) => {
  const addedKeys = [];
  return preparatoryArr.reduce((acc, elem, index) => {
    const { status, key, value } = elem;
    if (!addedKeys.includes(key)) {
      addedKeys.push(key);
      const nextElem = preparatoryArr[index + 1];
      if (nextElem) {
        const nextElemKey = preparatoryArr[index + 1].key;
        if (key === nextElemKey) {
          const nextElemValue = preparatoryArr[index + 1].value;
          const changedValue = `from ${nextElemValue} to ${value}`;
          acc.push(formStringFromObject(key, changedValue, actionList.changed));
          return acc;
        }
      }
      if (status === 'deleted') {
        acc.push(formStringFromObject(key, '', actionList[status]));
      } else {
        acc.push(formStringFromObject(key, value, actionList[status]));
      }
    }
    return acc;
  }, []);
};

const makeObjFromElemData = (elem, path) => {
  const {
    name,
    status,
    children,
    value,
  } = elem;
  path.push(name);
  const elemFullPath = path.join('.');
  if (children) {
    return { key: elemFullPath, status, value: '[complex value]' };
  }
  if (typeof value === 'string') {
    return { key: elemFullPath, status, value: `'${value}'` };
  }
  return { key: elemFullPath, status, value };
};

const getElemDataWithFullPath = (elem, path = []) => {
  const { name, status, children } = elem;
  if (status !== 'unchanged') {
    return makeObjFromElemData(elem, path);
  }
  if (children) {
    const fullPaths = children.map((child) => getElemDataWithFullPath(child, [...path, ...[name]]));
    return fullPaths.flat();
  }
  return [];
};

const prepareArr = (diff) => {
  const preparatoryArr = diff.reduce((acc, elem) => {
    const elemDataWithFullPath = getElemDataWithFullPath(elem);
    acc.push(elemDataWithFullPath);
    return acc;
  }, []);
  return preparatoryArr.flat();
};

const makePlainFormat = (diff) => {
  const preparatoryArr = prepareArr(diff);
  const plainFormattedResult = formResultArr(preparatoryArr);
  return plainFormattedResult.join('\n');
};

export default makePlainFormat;
