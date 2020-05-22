import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import findDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const getPath = (filePath) => path.join(__dirname, '..', '__fixtures__', filePath);

test('genDiff', () => {
  const pathToFile1 = getPath('before.json');
  const pathToFile2 = getPath('after.json');
  const pathToResultFile = getPath('result');
  const result = fs.readFileSync(pathToResultFile,'utf-8').trim();
  expect(findDiff(pathToFile1, pathToFile2)).toBe(result);
});
