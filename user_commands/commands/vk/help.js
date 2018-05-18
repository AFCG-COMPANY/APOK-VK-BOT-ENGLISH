

const VK = require('../../../config/constants');
const vk_admin_id = require('../../../config/keys');

const VKbot = require('../../../index').VKbot;
const check_registration_with_vk = require('../../../index').check_registration_with_vk;

const help = function(msg){
    console.log('help');
    console.log(VKbot);
    console.log(msg);
    var vk_id = (msg.peer_id).toString();
    console.log(vk_id);
    var user_message = msg.body;
    user_message = user_message.substring(5);
    VKbot.send('ЗАДАЛИ ВОПРОС!! \n' + msg.body, vk_admin_id);
    console.log(user_message);
    var userID = check_registration_with_vk(vk_id);

    if (/\S/.test(user_message))
    {
        // save user message
        save_help(vk_id, user_message, VK);
        VKbot.send('Мы скоро ответим', msg.peer_id);
        VKbot.send('ЗАДАЛИ ВОПРОС!! \n' + msg.body, vk_admin_id);
    }
    else {
        VKbot.send('Стандартный ответ', msg.peer_id);
    }
}


module.exports = help;

