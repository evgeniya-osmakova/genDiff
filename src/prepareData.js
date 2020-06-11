import path from 'path';
import fs from 'fs';

const prepareData = (pathToFile) => {
  const dataType = path.extname(pathToFile).slice(1);
  const data = fs.readFileSync(pathToFile, 'utf-8');
  return { dataType, data };
};

export default prepareData;
