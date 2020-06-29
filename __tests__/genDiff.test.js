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

  const testData = ['json', 'yaml', 'ini'];

  beforeAll(() => {
    testResults = {
      json: fs.readFileSync(getFixturePath('jsonResult.txt'),'utf-8').trim(),
      stylish: fs.readFileSync(getFixturePath('stylishResult.txt'),'utf-8').trim(),
      plain: fs.readFileSync(getFixturePath('plainResult.txt'),'utf-8').trim(),
    }
  });

  test.each(testData)('test %s format %s data', (type) => {
    const pathToBeforeFile = getFixturePath(`before_${type}.${type}`);
    const pathToAfterFile = getFixturePath(`after_${type}.${type}`);
    expect(findDiff(pathToBeforeFile, pathToAfterFile, 'json')).toBe(testResults.json);
    expect(findDiff(pathToBeforeFile, pathToAfterFile, 'stylish')).toBe(testResults.stylish);
    expect(findDiff(pathToBeforeFile, pathToAfterFile, 'plain')).toBe(testResults.plain);
  });
  // test('wrong extname', () => {
  //   const pathToBeforeFile = getFixturePath('1.json');
  //   const pathToAfterFile = getFixturePath('2.json');
  //   expect(findDiff(pathToBeforeFile, pathToAfterFile, 'stylish')).toBe(fs.readFileSync(getFixturePath('3res.txt'),'utf-8').trim(),);
  // });
});

describe('Errors:', () => {
  test('wrong extname', () => {
    const pathToBeforeFile = getFixturePath('stylishResult.txt');
    const pathToAfterFile = getFixturePath('stylishResult.txt');
    expect(() => findDiff(pathToBeforeFile, pathToAfterFile, 'plain')).toThrowError();
  });

  test('wrong format', () => {
    const pathToBeforeFile = getFixturePath('before_json.json');
    const pathToAfterFile = getFixturePath('after_json.json');
    expect(() => findDiff(pathToBeforeFile, pathToAfterFile, 'undefined')).toThrowError();
  });
});
