const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('d:/appzeto project/tailor/frontend/src/modules/customer');

let count = 0;
files.forEach(file => {
  if (!file.endsWith('.jsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace navigate('/path') to navigate('/user/path')
  // Except for /login, /welcome
  content = content.replace(/navigate\('\/(?!user|login|welcome)([^']*)'\)/g, (match, p1) => {
    return p1 === '' ? `navigate('/user')` : `navigate('/user/${p1}')`;
  });
  
  // Replace to="/path" to to="/user/path"
  // Except for /login, /welcome
  content = content.replace(/to="\/(?!user|login|welcome)([^"]*)"/g, (match, p1) => {
    return p1 === '' ? `to="/user"` : `to="/user/${p1}"`;
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    count++;
    console.log('Updated', file);
  }
});
console.log('Total files updated:', count);
