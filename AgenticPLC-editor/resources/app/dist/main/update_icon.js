const fs = require('fs');
let c = fs.readFileSync('main.js', 'utf8');
c = c.replace(/"icon\.png"/g, '"icon.ico"');
fs.writeFileSync('main.js', c);
console.log('Replaced icon.png with icon.ico in main.js');
