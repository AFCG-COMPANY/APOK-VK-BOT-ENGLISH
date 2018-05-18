"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_vk_bot_1 = require("node-vk-bot");
var fs = require("fs");
var keys_1 = require("./config/keys");
var constants_1 = require("./config/constants");
var check_user_answer_1 = require("./user_commands/utils/check_user_answer");
var TelegramBot = require('node-telegram-bot-api');
var emoji = require('node-emoji');
var save_help = require("./user_commands/utils/save_help");
// bot config
exports.VKbot = new node_vk_bot_1.Bot({
    token: keys_1.vk_token
}).start();
var help = require('./user_commands/commands/vk/help');
var TGbot = new TelegramBot(keys_1.tg_token, { polling: false });
// Matches "/echo [whatever]"
TGbot.onText(/\/help (.+)/, function (msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    var tg_id = msg.chat.id;
    var user_message = match[1]; // the captured "whatever"
    TGbot.sendMessage(tg_id, 'help part');
    if (/\S/.test(user_message)) {
        // save user message
        save_help(tg_id, user_message, constants_1.TELEGRAM);
        TGbot.sendMessage(tg_id, 'Мы скоро ответим');
        TGbot.sendMessage(keys_1.tg_admin_id, 'ЗАДАЛИ ВОПРОС!! \n' + user_message);
    }
    else {
        TGbot.send(tg_id, 'Стандартный ответ');
    }
});
// Matches "/echo [whatever]"
TGbot.onText(/\/echo (.+)/, function (msg, match) {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
    var chatId = msg.chat.id;
    var resp = match[1]; // the captured "whatever"
    // send back the matched "whatever" to the chat
    TGbot.sendMessage(chatId, emoji.get('coffee'));
    TGbot.sendMessage(chatId, resp);
});
TGbot.on('message', function (msg) {
    var chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    TGbot.sendMessage(chatId, 'Received your message');
});
// bot functions
exports.VKbot.get(/^\/start*/, function start(msg) {
    var user_message = msg.body;
    user_message = user_message.substring(6);
    user_message = user_message.replace(/\s/g, '');
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    exports.VKbot.send(emoji.get('coffee'), msg.peer_id);
    if (user_message != '') {
        if (check_token(user_message)) {
            if (set_access(userID)) {
                exports.VKbot.send('Теперь у вас есть доступ! \n Можете заниматься', msg.peer_id);
            }
            else {
                exports.VKbot.send('У вас уже есть доступ \n Можете продолжить обучение!', msg.peer_id);
            }
        }
        else {
            exports.VKbot.send('Похоже, вы ввели неправильный токен \n Попробуйте еще раз!', msg.peer_id);
        }
    }
    else {
        exports.VKbot.send('Привет! Стандартное сообщение', msg.peer_id);
    }
});
exports.VKbot.get(/^\/getclasswork*/, function getclasswork(msg) {
    console.log("getclasswork");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);
    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];
    if (user_progress == num_of_lessons) {
        exports.VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        exports.VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else {
        var lessonMap = get_current_lesson(user_progress);
        for (var title in lessonMap) {
            exports.VKbot.send(title, msg.peer_id, {
                attachment: lessonMap[title]
            });
        }
    }
});
exports.VKbot.get(/^\/gethomework*/, function gethomework(msg) {
    console.log("gethomework");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);
    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];
    if (user_progress == num_of_lessons) {
        exports.VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        exports.VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else {
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap) {
            exports.VKbot.send(title, msg.peer_id, {
                attachment: lessonMap[title][0]
            });
        }
    }
});
exports.VKbot.get(/^\/sendhomework*/, function sendhomework(msg) {
    console.log("sendhomework");
    var userAnswer = (msg.body).substring(17);
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);
    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];
    if (user_progress == num_of_lessons) {
        exports.VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        exports.VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else {
        var resultAnsver = [];
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap) {
            resultAnsver = resultAnsver.concat(lessonMap[title][1]);
        }
        var inspectionResult = check_user_answer_1.check_user_answer(userAnswer, resultAnsver, constants_1.TELEGRAM);
        if (inspectionResult['decided']) {
            exports.VKbot.send("Ответ принят!", msg.peer_id);
            exports.VKbot.send(access_to_new_lesson(userID), msg.peer_id);
        }
        else {
            exports.VKbot.send("Плохой ответ((", msg.peer_id);
        }
    }
});
exports.VKbot.get(/^\/help*/, help);
// utils functions
function get_user_progress(userID) {
    var jsonUsers = read_json('./utils/users/users.json');
    return jsonUsers[userID]['english_tutor'];
}
function get_current_lesson(progress) {
    var jsonLessons = read_json('./utils/courses/english_tutor/english_tutor_theory.json');
    return jsonLessons[progress];
}
function get_current_homework(progress) {
    var jsonLessons = read_json('./utils/courses/english_tutor/english_tutor_tasks.json');
    return jsonLessons[progress];
}
function access_to_new_lesson(userID) {
    var jsonUsers = read_json('./utils/users/users.json');
    var current_user_progress = parseInt(jsonUsers[userID]['english_tutor']);
    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = parseInt(course_meta['course_size']);
    if (current_user_progress == num_of_lessons) {
        return "Вы прошли весь курс. \n Поздравляем!";
    }
    else {
        current_user_progress++;
        jsonUsers[userID]["english_tutor"] = current_user_progress.toString();
        write_json("./utils/users/users.json", jsonUsers);
    }
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
module.exports = check_registration_with_vk;
