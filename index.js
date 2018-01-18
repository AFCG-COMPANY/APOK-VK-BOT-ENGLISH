"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_vk_bot_1 = require("node-vk-bot");
var database_1 = require("./utils/database");
var bot = new node_vk_bot_1.Bot({
    token: '251d5365d4fa3f8f44fa1a29a95fd8df030a094ebfa6b4d536cefbdab8e438994272e2bd16dd09f21fcbf' // don't even try to use this token
}).start();
console.log(bot);
bot.get(/start*/, function start() {
});
bot.get(/getclasswork*/, function getclassword() {
});
bot.get(/gethomework*/, function gethomework() {
});
bot.get(/sendhomework*/, function sendhomework() {
});
bot.get(/help*/, function help(msg) {
    var help = new database_1.Help();
    help.save(null, {
        message: 'new message',
        userID: 21,
        answerd: 0
    });
    console.log('save');
});
bot.get(/cat|kitten/, function (msg) {
    bot.send('Take this', msg.peer_id, {
        attachment: 'doc200234103_457714661'
    });
});
