const actionList = {
  deleted: 'was deleted',
  added: 'was added with value: ',
  changed: 'was changed ',
};

const formStringFromObject = (key, value, action) => `Property '${key}' ${action}${value}`;

const formResultArr = (preparatoryArr) => {
  const addedKeys = [];
  const resultArr = preparatoryArr.reduce((acc, elem, index) => {
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
  return resultArr;
};

const makeObjFromElemData = (elem, path) => {
  const { name, status } = elem;
  path.push(name);
  const child = elem.value[0];
  const elemFullPath = path.join('.');
  if (child instanceof Object) {
    return { key: elemFullPath, status, value: '[complex value]' };
  }
  if (typeof child === 'string') {
    return { key: elemFullPath, status, value: `'${child}'` };
  }
  return { key: elemFullPath, status, value: child };
};

const getElemDataWithFullPath = (elem, path = []) => {
  const { name, value, status } = elem;
  if (status !== 'unchanged') {
    return makeObjFromElemData(elem, path);
  }
  if (value.length > 1 || value[0] instanceof Object) {
    const fullPaths = value.map((child) => {
      if (child instanceof Object) {
        return getElemDataWithFullPath(child, [...path, ...[name]]);
      }
      return [];
    });
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
