import path from 'path';
import fs from 'fs';

const prepareData = (pathToFile) => {
  const extname = path.extname(pathToFile);
  const data = fs.readFileSync(pathToFile, 'utf-8');
  return { extname, data };
};

export default prepareData;
