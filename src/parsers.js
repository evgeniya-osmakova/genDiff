import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const formats = {
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

const parse = (data, extname) => {
  if (!_.has(formats, extname)) {
    throw new Error(`Unknown type of file: ${extname}`);
  }
  return formats[extname](data);
};

export default parse;
