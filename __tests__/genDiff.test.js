import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import findDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const getFixturePath = (filePath) => path.join(__dirname, '..', '__fixtures__', filePath);

const testData1 = [
  ['json', 'beforeJSON.json', 'afterYAML.yaml', 'jsonResult.txt'],
  ['stylish', 'beforeYAML.yml', 'afterINI.ini', 'stylishResult.txt'],
  ['plain', 'beforeINI.ini', 'afterJSON.json', 'plainResult.txt']
]

test.each(testData1)('test %s format', (format, fileNameOfBeforeFile, fileNameOfAfterFile, fileNameOfResultFile) => {
  const pathToBeforeFile = getFixturePath(fileNameOfBeforeFile);
  const pathToAfterFile2 = getFixturePath(fileNameOfAfterFile);
  const pathToResultFile = getFixturePath(fileNameOfResultFile);
  const result = fs.readFileSync(pathToResultFile,'utf-8').trim();
  expect(findDiff(pathToBeforeFile, pathToAfterFile2, format)).toBe(result);
});

test('wrong extname', () => {
  const pathToBeforeFile = getFixturePath('stylishResult.txt');
  const pathToAfterFile2 = getFixturePath('stylishResult.txt');
  expect(() => findDiff(pathToBeforeFile, pathToAfterFile2, 'plain')).toThrowError();
});

test('wrong format', () => {
  const pathToBeforeFile = getFixturePath('beforeJSON.json');
  const pathToAfterFile2 = getFixturePath('afterJSON.json');
  expect(() => findDiff(pathToBeforeFile, pathToAfterFile2, 'undefined')).toThrowError();
});
