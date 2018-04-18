var lines = require('fs').readFileSync('tmp.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);

console.log(lines);
