fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));

file_path = 'english_tutor_tasks.json';
file_suffix = 'PR';
console.log(file_path);

var json = fs.readFileSync(file_path);
json = JSON.parse(json);
for (var key in json) {
    if (json.hasOwnProperty(key)) {
        console.log(key, json[key]);
        for (var local_key in json[key]){
            if (json[key].hasOwnProperty(local_key)){
                json[key][local_key] = {'vk_file': json[key][local_key][0], 'tg_file': 'Unit_' + toString(parseInt(key) + 1) + '_' + file_suffix + '.pdf', 'answers': json[key][local_key][1]}
            }
        }
    }
}

var json = JSON.stringify(json, null, 2);
fs.writeFileSync(file_path, json, 'utf8');