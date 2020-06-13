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
    ['json', 'json'],
    ['stylish', 'json'],
    ['plain', 'json'],
    ['json', 'yaml'],
    ['stylish', 'yaml'],
    ['plain', 'yaml'],
    ['json', 'ini'],
    ['stylish', 'ini'],
    ['plain', 'ini'],
  ]

  beforeAll(() => {
    testResults = {
      json: fs.readFileSync(getFixturePath('jsonResult.txt'),'utf-8').trim(),
      stylish: fs.readFileSync(getFixturePath('stylishResult.txt'),'utf-8').trim(),
      plain: fs.readFileSync(getFixturePath('plainResult.txt'),'utf-8').trim(),
    }
  });

  test.each(testData)('test %s format %s data', (format, type) => {
    const pathToBeforeFile = getFixturePath(`before_${type}.${type}`);
    const pathToAfterFile = getFixturePath(`after_${type}.${type}`);
    const result = testResults[format];
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
    const pathToBeforeFile = getFixturePath('before_json.json');
    const pathToAfterFile = getFixturePath('after_json.json');
    expect(() => findDiff(pathToBeforeFile, pathToAfterFile, 'undefined')).toThrowError();
  });
});
