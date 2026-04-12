import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all files recursively in src/modules/customer
const getAllFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  let filesArr = arrayOfFiles || [];
  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      filesArr = getAllFiles(dirPath + "/" + file, filesArr);
    } else {
      if (file.endsWith('.jsx')) {
        filesArr.push(path.join(dirPath, "/", file));
      }
    }
  });
  return filesArr;
};

const customerDir = path.join(__dirname, 'src/modules/customer');
const filesToUpdate = getAllFiles(customerDir);

const replacements = [
  { regex: /#1e3932/gi, replace: '#FD0053' },
  { regex: /#0a211e/gi, replace: '#FD0053' },
  { regex: /#142921/gi, replace: '#FD0053' },
  { regex: /#061512/gi, replace: '#cc496e' },
  { regex: /#0d1b16/gi, replace: '#cc496e' },
  { regex: /#152e28/gi, replace: '#cc496e' },
  { regex: /\bgold\b/gi, replace: 'pink' },
  { regex: /emerald|green/gi, replace: 'pink' }
];

filesToUpdate.forEach(fullPath => {
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated theme colors in ${fullPath.replace(__dirname, '')}`);
  }
});
