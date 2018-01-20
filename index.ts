import {Bot, Message} from 'node-vk-bot'
import * as path from 'path'
import {check_registration, check_token, help_save, update_course_status} from "./utils/database";


var bot = new Bot({
  token: '251d5365d4fa3f8f44fa1a29a95fd8df030a094ebfa6b4d536cefbdab8e438994272e2bd16dd09f21fcbf'  // don't even try to use this token
}).start();
console.log(bot);

bot.get(/start*/, function start(msg: Message){
    console.log(typeof msg.body);
    console.log(typeof msg.peer_id);

    var user_message = msg.body;
    user_message = user_message.substring(5);
    user_message = user_message.replace(/\s/g, '');

    if (/\S/.test(user_message))
    {
        // found something other than a space or line break
        var user_id = msg.peer_id;
        var id_from_user_database = check_registration(undefined, undefined, user_id, undefined);

        if (check_token(user_message)) {
            bot.send(update_course_status(id_from_user_database), msg.peer_id);
        }

        bot.send('', msg.peer_id);
    }
    else {
        bot.send('Привет! Стандартное сообщение', msg.peer_id);
    }
});

bot.get(/getclasswork*/, function getclassword(){

});

bot.get(/gethomework*/, function gethomework(){

});
bot.get(/sendhomework*/, function sendhomework(){

});
bot.get(/help*/, function help(msg: Message){

    console.log(typeof msg.body);
    console.log(typeof msg.peer_id);

    var user_message = msg.body;
    user_message = user_message.substring(4);

    if (/\S/.test(user_message))
    {
        // found something other than a space or line break
        var user_id = msg.peer_id;
        help_save(user_message, undefined, undefined, user_id, undefined);

        bot.send('Мы скоро ответим', msg.peer_id);
    }
    else {
        bot.send('Стандартный ответ', msg.peer_id);
    }
});

bot.get(/cat|kitten/, (msg: Message) => {
    bot.send('Take this', msg.peer_id, {
        attachment: 'doc200234103_457714661'
    })
});



