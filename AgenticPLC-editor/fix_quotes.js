const fs = require('fs');
const path = 'resources/app/dist/renderer/index.html';
let s = fs.readFileSync(path, 'utf-8');
const before = (s.match(/\\'/g) || []).length;
s = s.replace(/\\'/g, "'");
fs.writeFileSync(path, s, 'utf-8');
const after = (s.match(/\\'/g) || []).length;
console.log('Replaced', before - after, 'escape sequences. Remaining:', after);
