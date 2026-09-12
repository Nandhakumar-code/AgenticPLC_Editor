const fs = require('fs');
const html = fs.readFileSync('../renderer/index.html', 'utf8');
const scripts = html.match(/<script[^>]*>(.*?)<\/script>/gs);
if (scripts) {
  scripts.forEach((s, i) => {
    const code = s.replace(/<script[^>]*>/g, '').replace(/<\/script>/g, '');
    fs.writeFileSync('test_script_' + i + '.js', code);
    try {
      require('child_process').execSync('node -c test_script_' + i + '.js');
      console.log('Script ' + i + ' OK');
    } catch (e) {
      console.log('Script ' + i + ' Error:', e.stderr.toString());
    }
  });
} else {
  console.log('No scripts found');
}
