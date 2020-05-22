import fs from 'fs';
import _ from 'lodash';

const findDiff = (pathToFile1, pathToFile2) => {
  const diff = ['{'];
  const json1 = fs.readFileSync(pathToFile1, 'utf-8');
  const json2 = fs.readFileSync(pathToFile2, 'utf-8');
  const data1 = JSON.parse(json1);
  const data2 = JSON.parse(json2);
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);
  keys2.forEach((key) => {
    if (_.has(data1, key)) {
      if (data1[key] === data2[key]) {
        diff.push(`   ${key}: ${data1[key]}`);
      } else {
        diff.push(` + ${key}: ${data2[key]}`);
        diff.push(` - ${key}: ${data1[key]}`);
      }
    } else {
      diff.push(` + ${key}: ${data2[key]}`);
    }
  });
  keys1.forEach((key) => {
    if (!_.has(data2, key)) {
      diff.push(` - ${key}: ${data1[key]}`);
    }
  });
  diff.push('}');
  return diff.join('\n');
};

export default findDiff;
