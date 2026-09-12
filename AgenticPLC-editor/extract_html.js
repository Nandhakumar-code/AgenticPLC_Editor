const fs = require('fs');
const src = fs.readFileSync('resources/app/dist/renderer/scratch.js', 'utf-8');
const match = src.match(/const htmlContent = `([\s\S]*?)`;/);
if (!match) { console.error('NO MATCH'); process.exit(1); }
const html = match[1];
fs.writeFileSync('resources/app/dist/renderer/index.html', html, 'utf-8');
console.log('Wrote ' + html.length + ' bytes to index.html');
