const fs = require('fs');
let code = fs.readFileSync('preload.js', 'utf8');

const patchStr = `
const cp=require("child_process");
const fsNode=require("fs");
Object.assign(r, {
  runOsCommand: (cmd, cwd) => new Promise(res => {
    cp.exec(cmd, {cwd: cwd || process.cwd()}, (err, stdout, stderr) => {
      res({err: err ? err.message : null, stdout, stderr});
    });
  }),
  readFileNode: (p) => fsNode.readFileSync(p, "utf8"),
  writeFileNode: (p, d) => fsNode.writeFileSync(p, d),
  readDirNode: (p) => fsNode.readdirSync(p)
});
return e.contextBridge.exposeInMainWorld("bridge",r)
`;

code = code.replace('return e.contextBridge.exposeInMainWorld("bridge",r)', patchStr);
fs.writeFileSync('preload.js', code);
console.log('Patched preload.js successfully');
