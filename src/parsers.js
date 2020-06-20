import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const iniParse = (data) => {
  const parsedData = ini.parse(data);
  const checkNumbers = (obj) => {
    const keys = _.keys(obj);
    return keys.reduce((acc, key) => {
      const value = obj[key];
      if (_.isObject(value)) {
        acc[key] = checkNumbers(value);
        return acc;
      }
      if (Number(value) && typeof value !== 'boolean') {
        acc[key] = Number(value);
        return acc;
      }
      acc[key] = obj[key];
      return acc;
    }, {});
  };
  return checkNumbers(parsedData);
};

const formats = {
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  json: JSON.parse,
  ini: iniParse,
};

const parse = (data, dataType) => {
  if (!_.has(formats, dataType)) {
    throw new Error(`Unknown type of data: ${dataType}`);
  }
  return formats[dataType](data);
};

export default parse;
