import {Bot, Message} from 'node-vk-bot'
import * as path from 'path'
import * as fs from "fs";
import {vk_token, vk_admin_id} from "./config/keys";
/*
var vk_admin_id = 200234103;

// don't even try to use this token
var vk_token =
    '251d5365d4fa3f8f44fa1a29a95fd8df030a094ebfa6b4d536cefbdab8e438994272e2bd16dd09f21fcbf';
*/
// bot config
var bot = new Bot({
  token: vk_token
}).start();

// bot functions
bot.get(/^start*/, function start(msg: Message){


    var user_message = msg.body;
    user_message = user_message.substring(5);
    user_message = user_message.replace(/\s/g, '');

    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);

    if (user_message != '')
    {
        if (check_token(user_message)){

            if (set_access(userID)){
                bot.send('Теперь у вас есть доступ! \n Можете заниматься', msg.peer_id);
            }
            else{
                bot.send('У вас уже есть доступ \n Можете продолжить обучение!', msg.peer_id);
            }
        }
        else{
            bot.send('Похоже, вы ввели неправильный токен \n Попробуйте еще раз!', msg.peer_id);
        }
    }
    else {
        bot.send('Привет! Стандартное сообщение', msg.peer_id);
    }
});

bot.get(/^getclasswork*/, function getclasswork(msg: Message){

    console.log("getclasswork");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        bot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        bot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var lessonMap = get_current_lesson(user_progress);
        for (var title in lessonMap){
            bot.send(title, msg.peer_id, {
                attachment: lessonMap[title]
            })
        }
    }

});

bot.get(/^gethomework*/, function gethomework(msg: Message){

    console.log("gethomework");
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        bot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        bot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap){
            bot.send(title, msg.peer_id, {
                attachment: lessonMap[title][0]
            })
        }
    }
});

bot.get(/^sendhomework*/, function sendhomework(msg : Message){
    console.log("sendhomework");
    var userAnswer = (msg.body).substring(16);
    var vk_id = (msg.peer_id).toString();
    var userID = check_registration_with_vk(vk_id);
    var user_progress = get_user_progress(userID);

    var course_meta = read_json('./utils/courses/english_tutor/english_tutor_meta.json');
    var num_of_lessons = course_meta['course_size'];

    if (user_progress == num_of_lessons){
        bot.send("Вы все прошли!!", msg.peer_id);
    }
    else if (user_progress == "-1") {
        bot.send("У вас нет доступа!!", msg.peer_id);
    }
    else{
        var resultAnsver = "";
        var lessonMap = get_current_homework(user_progress);
        for (var title in lessonMap){
            resultAnsver += lessonMap[title][1];
        }
        console.log(userAnswer);
        console.log(resultAnsver);
        if (userAnswer == resultAnsver){
            bot.send("Все правильно!", msg.peer_id);
            bot.send(access_to_new_lesson(userID), msg.peer_id);

        }
        else {
            bot.send("Плохой ответ((", msg.peer_id);
        }

    }
});

bot.get(/^help*/, function help(msg: Message){

    var vk_id = (msg.peer_id).toString();
    var user_message = msg.body;
    user_message = user_message.substring(4);

    var userID = check_registration_with_vk(vk_id);

    if (/\S/.test(user_message))
    {
        // save user message
        help_save(user_message, userID);

        bot.send('Мы скоро ответим', msg.peer_id);
        bot.send('ЗАДАЛИ ВОПРОС!! \n' + msg.body, vk_admin_id)
    }
    else {
        bot.send('Стандартный ответ', msg.peer_id);
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

function help_save(message : string, id : string){

    var jsonHelpVk = read_json('./utils/help/vk_help.json');

    if (jsonHelpVk.hasOwnProperty(id)){
        jsonHelpVk[id].push(message);
    }
    else{
        jsonHelpVk[id] = [message];
    }

    write_json('./utils/help/vk_help.json', jsonHelpVk);
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



