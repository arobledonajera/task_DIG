const fs = require('fs').promises;
const path = require('path');

const getPath = filePath => path.join(__dirname, filePath);

const readFile = async path => {
  try {
    return await fs.readFile(getPath(path), 'utf-8');
  }
  catch (ex) {
    return null;
  }
};

const writeFile = async (path, data) => {
  await fs.writeFile(getPath(path), data, 'utf-8');
};

module.exports = {
  getPath, readFile, writeFile
};