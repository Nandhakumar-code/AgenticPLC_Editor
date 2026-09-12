const fs = require('fs');
const s = fs.readFileSync('resources/app/dist/renderer/index.html', 'utf-8');
const scriptStart = s.indexOf('<script>');
const scriptEnd = s.lastIndexOf('</script>');
const js = s.substring(scriptStart + 8, scriptEnd);
try {
  new Function(js);
  console.log('JS PARSES OK');
} catch(e) {
  console.log('Error:', e.message);
  const idx = js.indexOf("'");
  if (idx >= 0) {
    console.log('Around first single quote in JS:', JSON.stringify(js.substring(Math.max(0,idx-50), idx+50)));
  }
  // Try to find the problematic area
  const lines = js.split('\n');
  for (let i = 0; i < lines.length; i++) {
    try {
      new Function(lines.slice(0, i+1).join('\n'));
    } catch(e2) {
      if (e2.message !== e.message) {
        console.log('Error starts around line', i+1, ':', e2.message);
        console.log('Line', i+1, ':', JSON.stringify(lines[i]));
        break;
      }
    }
  }
}
