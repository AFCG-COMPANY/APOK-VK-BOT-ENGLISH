from time import sleep
import vk
from telegram.ext import Updater, CommandHandler


session = vk.Session(access_token='e4156c1e9a2000469195d054ba11bdafe5869b64e72cbef61dab1f5f00f96631cb710e664a49e8c4fa66f')
api = vk.API(session, oauth=1, v='5.80', lang='ru', timeout=10)
print(api.messages.getConversations())
print(api.messages.getHistory(user_id=200234103))
api.messages.send(user_id=200234103, message='text')


def hello(bot, update):
    update.message.reply_text(
        'Hello {}'.format(update.message.from_user.first_name))


updater = Updater('514641629:AAGyRyh5kvd1f59l9nQ4787-AGl7NOauyNg')

updater.dispatcher.add_handler(CommandHandler('hello', hello))

updater.start_polling()
updater.idle()


