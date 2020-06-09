import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const formats = {
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

const parse = (data, dataType) => {
  if (!_.has(formats, dataType)) {
    throw new Error(`Unknown type of file: ${dataType}`);
  }
  return formats[dataType](data);
};

export default parse;
