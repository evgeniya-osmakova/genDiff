#!/usr/bin/env node

import program from 'commander';
import findDiff from '../src/index.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<pathToFile1> <pathToFile2>')
  .action((pathToFile1, pathToFile2) => {
    console.log(findDiff(pathToFile1, pathToFile2, program.format));
  })
  .parse(process.argv);

export default findDiff;
