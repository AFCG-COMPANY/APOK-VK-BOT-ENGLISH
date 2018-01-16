import { Bot } from 'node-vk-bot'
import {gethomework, help, sendhomework, start} from "./commands/commands_main";

console.log(typeof Bot);

var bot = new Bot({
  token: 'jcrweifnewjgoi'  // don't even try to use this token
}).start();

console.log(bot);

bot.get(/start*/, start);
bot.get(/gethomework*/, gethomework);
bot.get(/sendhomework*/, sendhomework);
bot.get(/help*/, help);


