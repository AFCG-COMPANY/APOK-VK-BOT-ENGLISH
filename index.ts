import {Bot, Message} from 'node-vk-bot'
import * as path from 'path'
import * as fs from "fs";
import {vk_token, vk_admin_id, tg_token, tg_admin_id} from "./config/keys";
import {TELEGRAM} from "./config/constants";
import {check_user_answer} from "./user_commands/utils/check_user_answer";
const TelegramBot = require('node-telegram-bot-api');

// bot config
var VKbot = new Bot({
  token: vk_token
}).start();

const TGbot = new TelegramBot(tg_token, {polling: true});

// Matches "/echo [whatever]"
TGbot.onText(/\/help (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const userID = msg.chat.id;
    const user_message = match[1]; // the captured "whatever"

    TGbot.send('help part', userID);
    if (/\S/.test(user_message))
    {
        // save user message
        //help_save(user_message, userID, 'tg');
        //console.log(check_user_answer());
        TGbot.send('Мы скоро ответим', userID);
        TGbot.send('ЗАДАЛИ ВОПРОС!! \n' + user_message, tg_admin_id);
    }
    else {
        TGbot.send('Стандартный ответ', userID);
    }
});

// Matches "/echo [whatever]"
TGbot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    TGbot.sendMessage(chatId, resp);
});

TGbot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    TGbot.sendMessage(chatId, 'Received your message');
});
// bot functions
VKbot.get(/^start*/, function start(msg: Message){


    var user_message = msg.body;
    user_message = user_message.substring(5);
    user_message = user_message.replace(/\s/g, '');

    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);

    if (user_message != '')
    {
        if (check_token(user_message)){

            if (set_access(userID)){
                VKbot.send('Теперь у вас есть доступ! \n Можете заниматься', msg.peer_id);
            }
            else{
                VKbot.send('У вас уже есть доступ \n Можете продолжить обучение!', msg.peer_id);
            }
        }
        else{
            VKbot.send('Похоже, вы ввели неправильный токен \n Попробуйте еще раз!', msg.peer_id);
        }
    }
    else {
        VKbot.send('Привет! Стандартное сообщение', msg.peer_id);
    }
});

VKbot.get(/^getclasswork*/, function getclasswork(msg: Message){

    console.log("getclasswork");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var lessonMap = get_current_lesson(user_progress);
        for (var title in lessonMap){
            VKbot.send(title, msg.peer_id, {
                attachment: lessonMap[title]
            })
        }
    }

});

VKbot.get(/^gethomework*/, function gethomework(msg: Message){

    console.log("gethomework");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap){
            VKbot.send(title, msg.peer_id, {
                attachment: lessonMap[title][0]
            })
        }
    }
});

VKbot.get(/^sendhomework*/, function sendhomework(msg : Message){
    console.log("sendhomework");
    var userAnswer = (msg.body).substring(16);
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        VKbot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        VKbot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var resultAnsver = [];
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap){
            resultAnsver = resultAnsver.concat(lessonMap[title][1]);
        }
        var inspectionResult = check_user_answer(userAnswer, resultAnsver, TELEGRAM);
        if (inspectionResult['decided']){
            VKbot.send("Ответ принят!", msg.peer_id);
            VKbot.send(access_to_new_lesson(userID), msg.peer_id);

        }
        else {
            VKbot.send("Плохой ответ((", msg.peer_id);
        }

    }
});

VKbot.get(/^help*/, function help(msg: Message){

    var vk_id = (msg.peer_id).toString();
    var user_message = msg.body;
    user_message = user_message.substring(4);

    var userID = check_registration_with_vk(vk_id);

    if (/\S/.test(user_message))
    {
        // save user message
        //help_save(user_message, userID, 'vk');
        //console.log(check_user_answer());
        VKbot.send('Мы скоро ответим', msg.peer_id);
        VKbot.send('ЗАДАЛИ ВОПРОС!! \n' + msg.body, vk_admin_id);
    }
    else {
        VKbot.send('Стандартный ответ', msg.peer_id);
    }
});

// utils functions
function get_user_progress(userID : string) : string{

    var jsonUsers = read_json('./utils/users/users.json');
    return jsonUsers[userID]['english_tutor'];
}


function get_current_lesson(progress) : object{

    var jsonLessons = read_json('./utils/courses/english_tutor/english_tutor_theory.json');
    return jsonLessons[progress];
}

function get_current_homework(progress) : object{

    var jsonLessons = read_json('./utils/courses/english_tutor/english_tutor_tasks.json');
    return jsonLessons[progress];
}

function access_to_new_lesson(userID) : string{
    var jsonUsers = read_json('./utils/users/users.json');
    var current_user_progress = parseInt(jsonUsers[userID]['english_tutor']);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = parseInt(course_meta['course_size']);


    if(current_user_progress == num_of_lessons){
        return "Вы прошли весь курс. \n Поздравляем!"
    }
    else{
        current_user_progress++;
        jsonUsers[userID]["english_tutor"] = current_user_progress.toString();
        write_json("./utils/users/users.json", jsonUsers);
    }

}

function help_save(message : string, id : string, platform : string){

    var jsonHelp = read_json('./utils/help/vk_help.json');

    if (jsonHelp.hasOwnProperty(id)){
        jsonHelp[id].push(message);
    }
    else{
        jsonHelp[id] = [message];
    }

    write_json('./utils/help/vk_help.json', jsonHelp);
}

function check_registration_with_vk(vk_id : string) : string{

    var jsonUsers = read_json('./utils/users/users.json');
    for (var user in jsonUsers){
        if (jsonUsers[user]['vk'] === vk_id){
            return user;
        }
    }

    var count = Object.keys(jsonUsers).length;
    var countS = count.toString();
    jsonUsers[countS] = {
        "email" : "",
        "password" : "",
        "vk" : vk_id,
        "tg" : "",
        "english_tutor" : "-1"
    };
    write_json('./utils/users/users.json', jsonUsers);
    return countS;
}

function check_token(token : string) : boolean{
    var jsonToken = read_json('./utils/token/tokens.json');
    if (jsonToken.hasOwnProperty(token)){
        delete jsonToken[token];
        write_json('./utils/token/tokens.json', jsonToken);
        return true;
    }
    else{
        return false;
    }
}

function set_access(userID : string) : boolean{
    var jsonUsers = read_json('./utils/users/users.json');
    if(jsonUsers[userID]['english_tutor'] == "-1") {
        jsonUsers[userID]['english_tutor'] = "0";
        write_json('./utils/users/users.json', jsonUsers);
        return true;
    }
    else {
        return false;
    }
}

function read_json(file_path : string) : object{

    var json = fs.readFileSync(file_path);
    json = JSON.parse(json);
    return json;
}

function write_json(file_path : string, json : object){

    var json = JSON.stringify(json);
    fs.writeFileSync(file_path, json, 'utf8');

}



