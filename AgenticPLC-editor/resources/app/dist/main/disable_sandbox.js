const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');
code = code.replace(/sandbox:!0/g, 'sandbox:!1');
fs.writeFileSync('main.js', code);
console.log('Disabled sandbox in main.js');
