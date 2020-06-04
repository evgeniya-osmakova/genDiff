import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {test, expect, beforeAll, describe} from '@jest/globals';
import findDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const getFixturePath = (filePath) => path.join(__dirname, '..', '__fixtures__', filePath);

describe('Different files & formats:', () => {
  let testResults;

  const testData = [
    ['json', 'beforeJSON.json', 'afterYAML.yaml', 0],
    ['stylish', 'beforeYAML.yml', 'afterINI.ini', 1],
    ['plain', 'beforeINI.ini', 'afterJSON.json', 2],
  ]

  beforeAll(() => {
    const preparatoryData = ['jsonResult.txt', 'stylishResult.txt', 'plainResult.txt'];
    testResults = preparatoryData.map((fileNameOfResultFile) => {
      const pathToResultFile = getFixturePath(fileNameOfResultFile);
      return fs.readFileSync(pathToResultFile,'utf-8').trim();
    })
  });

  test.each(testData)('test %s format', (format, fileNameOfBeforeFile, fileNameOfAfterFile, index) => {
    const pathToBeforeFile = getFixturePath(fileNameOfBeforeFile);
    const pathToAfterFile = getFixturePath(fileNameOfAfterFile);
    const result = testResults[index];
    expect(findDiff(pathToBeforeFile, pathToAfterFile, format)).toBe(result);
  });
});


describe('Errors:', () => {
  test('wrong extname', () => {
    const pathToBeforeFile = getFixturePath('stylishResult.txt');
    const pathToAfterFile = getFixturePath('stylishResult.txt');
    expect(() => findDiff(pathToBeforeFile, pathToAfterFile, 'plain')).toThrowError();
  });

  test('wrong format', () => {
    const pathToBeforeFile = getFixturePath('beforeJSON.json');
    const pathToAfterFile = getFixturePath('afterJSON.json');
    expect(() => findDiff(pathToBeforeFile, pathToAfterFile, 'undefined')).toThrowError();
  });
});
