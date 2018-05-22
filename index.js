const vkBot = require('node-vk-bot').Bot;
const tgBot = require('node-telegram-bot-api');

const vk_token = require('./config/keys').vk_token;
const tg_token = require('./config/keys').tg_token;

const VKbot = new vkBot({
    token: vk_token
}).start();

const TGbot = new tgBot(
    tg_token, { polling: true }
);

VKbot.get(/[\s\S]*/, function answer(msg) {
    var vk_id = (msg.peer_id).toString();
    VKbot.send('hello', msg.peer_id)
})

TGbot.on(/[\s\S]*/, function answer(msg) {
    var chatId = msg.chat.id;
    // send a message to the chat acknowledging receipt of their message
    TGbot.sendMessage(chatId, 'hello');
});
