const fs = require('fs');
const path = require('path');

const componentsDir = path.resolve(__dirname, '../src');

const generateExposes = (dir = componentsDir, base = './') => {
  const items = fs.readdirSync(dir); // Read the contents of the directory
  const exposes = {};

  items.forEach((item) => {
    const fullPath = path.join(dir, item); // Get the full path
    const relativePath = path.relative(componentsDir, fullPath); // Relative path from `componentsDir`

    if (fs.statSync(fullPath).isDirectory()) {
      // If it's a folder, recurse into it
      Object.assign(exposes, generateExposes(fullPath, `${base}${item}/`));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      // If it's a file, add it to the exposes
      const name = path.basename(item, path.extname(item)); // Remove extension
      exposes[`./${name}`] = `./src/${relativePath.replace(/\\/g, '/')}`; // Normalize path for Webpack
    }
  });
  return exposes;
};

module.exports = generateExposes;
