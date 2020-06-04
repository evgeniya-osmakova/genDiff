import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';

const formats = {
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

const parse = (pathToFile) => {
  const data = fs.readFileSync(pathToFile, 'utf-8');
  const extname = path.extname(pathToFile);
  if (!_.has(formats, extname)) {
    throw new Error(`Unknown type of file: ${extname}`);
  }
  return formats[extname](data);
};

export default parse;
