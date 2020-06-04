import _ from 'lodash';
import makePlainFormat from './plain.js';
import makeStylishFormat from './stylish.js';
import makeJSONFormat from './json.js';

const listOfFormats = {
  plain: makePlainFormat,
  stylish: makeStylishFormat,
  json: makeJSONFormat,
};

const formatDiff = (diff, format) => {
  if (!_.has(listOfFormats, format)) {
    throw new Error(`Unknown type of format: ${format}`);
  }
  return listOfFormats[format](diff);
};

export default formatDiff;
