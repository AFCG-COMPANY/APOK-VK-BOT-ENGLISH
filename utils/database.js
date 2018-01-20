"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function help_save(message, email, phone, vk, tg) {
    console.log(message);
    var dir_name = './home/fedor/WebstormProjects/node-vk-bot/utils/help/';
    if (email) {
        var help = fs.readFileSync(dir_name + "email_help.json");
        help = JSON.parse(help);
        help[email] = message;
        fs.writeFile(dir_name + "email_help.json", help);
    }
    if (phone) {
        var help = fs.readFileSync(dir_name + "phone_help.json");
        help = JSON.parse(help);
        help[phone] = message;
        fs.writeFile(dir_name + "phone_help.json", help);
    }
    if (vk) {
        console.log('help save vk');
        var help = require(dir_name + "vk_help.txt");
        help[vk] = message;
        console.log('help save vk');
        console.log(help);
        fs.writeFile(dir_name + "vk_help.txt", help);
    }
    if (tg) {
        var help = fs.readFileSync(dir_name + "tg_help.json");
        help = JSON.parse(help);
        help[tg] = message;
        fs.writeFile(dir_name + "tg_help.json", help);
    }
}
exports.help_save = help_save;
;
function check_registration(email, password, vk, tg) {
    return -1;
}
exports.check_registration = check_registration;
function getIdByVk(vk) {
    return;
}
exports.getIdByVk = getIdByVk;
function update_course_status(user_id) {
    return '';
}
exports.update_course_status = update_course_status;
function check_token(token) {
    return false;
}
exports.check_token = check_token;
//check_registration(undefined, undefined, 123321, undefined);
//help_save( "test_help1", undefined, undefined, 21423543, undefined);
/*
db.run('CREATE TABLE help ( ID integer PRIMARY KEY, message text, userID text, answered integer );');
db.run('SELECT * FROM help');

db.all('SELECT * FROM help', [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});
*/
