#!/usr/bin/env node

import program from 'commander';
import fs from 'fs';
import _ from 'lodash';

const genDif = (pathToFile1, pathToFile2) => {
  const diff = ['{'];
  const json1 = fs.readFileSync(pathToFile1);
  const json2 = fs.readFileSync(pathToFile2);
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

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<pathToFile1> <pathToFile2>')
  .action((pathToFile1, pathToFile2) => console.log(genDif(pathToFile1, pathToFile2)))
  .parse(process.argv);

export default genDif;
