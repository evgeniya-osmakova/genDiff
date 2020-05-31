import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';

const formats = {
  '.yaml': (data) => yaml.safeLoad(data),
  '.yml': (data) => yaml.safeLoad(data),
  '.json': (data) => JSON.parse(data),
  '.ini': (data) => ini.parse(data),
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
