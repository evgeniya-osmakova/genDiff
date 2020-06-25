import _ from 'lodash';

const makePlainFormat = (diff) => {
  const iter = (innerData, elemPath) => {
    const stringify = (value) => {
      const formattedData = (typeof value === 'string') ? `'${value}'` : value;
      return (_.isObject(value)) ? '[complex value]' : formattedData;
    };

    const mappingNodeType = {
      deleted: (path) => `Property '${path.join('.')}' was deleted`,
      added: (path, { value }) => `Property '${path.join('.')}' was added with value: ${stringify(value)}`,
      changed: (path, node) => {
        const { addedValue, deletedValue } = node;
        return `Property '${path.join('.')}' was changed from ${stringify(deletedValue)} to ${stringify(addedValue)}`;
      },
      nested: (path, node) => {
        const { children } = node;
        return iter(children, path);
      },
      unchanged: () => [],
    };

    const formattedDiff = innerData.flatMap(
      (elem) => mappingNodeType[elem.status]([...elemPath, elem.name], elem),
    );
    return formattedDiff.join('\n');
  };
  return iter(diff, '');
};

export default makePlainFormat;
