var lines = require('fs').readFileSync('tmp.txt', 'utf-8')
    .split('\n')
    .filter(Boolean);

//console.log(lines);

for(var line of lines){
    console.log(line);
    resStr = '['
    for(var ch of line){
        if(ch == 'a' || ch == 'b' || ch == 'c' || ch == 'd'){
            resStr += '"' + ch + '"' + ', '
        }
    }
    resStr = resStr.substr(0, resStr.length - 2);
    resStr += ']'
    console.log(resStr)
}
