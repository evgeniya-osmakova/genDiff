import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const iniParse = (data) => {
  const parsedData = ini.parse(data);
  const checkNumbers = (obj) => {
    const keys = _.keys(obj);
    keys.forEach((key) => {
      const value = obj[key];
      if (_.isObject(value)) {
        checkNumbers(value);
      }
      if (Number(value) && typeof value !== 'boolean') {
        // eslint-disable-next-line no-param-reassign
        obj[key] = Number(value);
      }
    });
    return obj;
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
