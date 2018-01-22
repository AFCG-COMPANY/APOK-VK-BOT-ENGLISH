"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_vk_bot_1 = require("node-vk-bot");
var fs = require("fs");
var vk_admin_id = 200234103;
// don't even try to use this token
var vk_token = '251d5365d4fa3f8f44fa1a29a95fd8df030a094ebfa6b4d536cefbdab8e438994272e2bd16dd09f21fcbf';
var bot = new node_vk_bot_1.Bot({
    token: vk_token
}).start();
bot.get(/start*/, function start(msg) {
    var user_message = msg.body;
    user_message = user_message.substring(5);
    user_message = user_message.replace(/\s/g, '');
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    if (user_message != '') {
        if (check_token(user_message)) {
            if (set_access(userID)) {
                bot.send('Теперь у вас есть доступ! \n Можете заниматься', msg.peer_id);
            }
            else {
                bot.send('У вас уже есть доступ \n Можете продолжить обучение!', msg.peer_id);
            }
        }
        else {
            bot.send('Похоже, вы ввели неправильный токен \n Попробуйте еще раз!', msg.peer_id);
        }
    }
    else {
        bot.send('Привет! Стандартное сообщение', msg.peer_id);
    }
});
bot.get(/getclasswork*/, function getclasswork(msg) {
    console.log("getclasswork");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);
    if (user_progress == "-1") {
        bot.send("У вас нет доступа!!", msg.peer_id);
    }
    else {
        var lessonMap = get_current_lesson(user_progress);
        for (var title in lessonMap) {
            bot.send(title, msg.peer_id, {
                attachment: lessonMap[title]
            });
        }
    }
});
bot.get(/gethomework*/, function gethomework() {
});
bot.get(/sendhomework*/, function sendhomework() {
});
bot.get(/help*/, function help(msg) {
    var vk_id = (msg.peer_id).toString();
    var user_message = msg.body;
    user_message = user_message.substring(4);
    var userID = check_registration_with_vk(vk_id);
    if (/\S/.test(user_message)) {
        // save user message
        help_save(user_message, userID);
        bot.send('Мы скоро ответим', msg.peer_id);
        bot.send('ЗАДАЛИ ВОПРОС!! \n' + msg.body, vk_admin_id);
    }
    else {
        bot.send('Стандартный ответ', msg.peer_id);
    }
});
function get_user_progress(userID) {
    var jsonUsers = read_json('./utils/users/users.json');
    return jsonUsers[userID]['english_tutor'];
}
function get_current_lesson(progress) {
    var jsonLessons = read_json('./utils/courses/english_tutor/english_tutor_theory.json');
    return jsonLessons[progress];
}
function help_save(message, id) {
    var jsonHelpVk = read_json('./utils/help/vk_help.json');
    if (jsonHelpVk.hasOwnProperty(id)) {
        jsonHelpVk[id].push(message);
    }
    else {
        jsonHelpVk[id] = [message];
    }
    write_json('./utils/help/vk_help.json', jsonHelpVk);
}
function check_registration_with_vk(vk_id) {
    var jsonUsers = read_json('./utils/users/users.json');
    for (var user in jsonUsers) {
        if (jsonUsers[user]['vk'] === vk_id) {
            return user;
        }
    }
    var count = Object.keys(jsonUsers).length;
    var countS = count.toString();
    jsonUsers[countS] = {
        "email": "",
        "password": "",
        "vk": vk_id,
        "tg": "",
        "english_tutor": "-1"
    };
    write_json('./utils/users/users.json', jsonUsers);
    return countS;
}
function check_token(token) {
    var jsonToken = read_json('./utils/token/tokens.json');
    if (jsonToken.hasOwnProperty(token)) {
        delete jsonToken[token];
        write_json('./utils/token/tokens.json', jsonToken);
        return true;
    }
    else {
        return false;
    }
}
function set_access(userID) {
    var jsonUsers = read_json('./utils/users/users.json');
    if (jsonUsers[userID]['english_tutor'] == "-1") {
        jsonUsers[userID]['english_tutor'] = "0";
        write_json('./utils/users/users.json', jsonUsers);
        return true;
    }
    else {
        return false;
    }
}
function read_json(file_path) {
    var json = fs.readFileSync(file_path);
    json = JSON.parse(json);
    return json;
}
function write_json(file_path, json) {
    var json = JSON.stringify(json);
    fs.writeFileSync(file_path, json, 'utf8');
}
