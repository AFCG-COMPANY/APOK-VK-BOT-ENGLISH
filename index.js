"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_vk_bot_1 = require("node-vk-bot");
var commands_main_1 = require("./commands/commands_main");
console.log(typeof node_vk_bot_1.Bot);
var bot = new node_vk_bot_1.Bot({
    token: 'jcrweifnewjgoi' // don't even try to use this token
}).start();
console.log(bot);
bot.get(/start*/, commands_main_1.start);
bot.get(/gethomework*/, commands_main_1.gethomework);
bot.get(/sendhomework*/, commands_main_1.sendhomework);
bot.get(/help*/, commands_main_1.help);
