var fs = require('fs');
/*
var contents = fs.readFileSync('tmp.txt', 'utf8');
console.log(contents);
*/
fs.readFile("tmp.txt", function(err, data){
    console.log(data);
})