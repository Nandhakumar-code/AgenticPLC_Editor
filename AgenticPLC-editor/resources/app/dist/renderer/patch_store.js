const fs = require('fs');
let c = fs.readFileSync('c:/Users/ELCOT/AppData/Local/Programs/open-plc-editor/resources/app/dist/renderer/renderer.js', 'utf8');
const count = c.split('$y()').length - 1;
console.log('Found $y() count:', count);
c = c.replace(/\$y\(\)/g, '(window.__ROOT_STORE__=$y())');
fs.writeFileSync('c:/Users/ELCOT/AppData/Local/Programs/open-plc-editor/resources/app/dist/renderer/renderer.js', c);
console.log('Patched renderer.js!');
