from time import sleep
import vk


session = vk.Session(access_token='e4156c1e9a2000469195d054ba11bdafe5869b64e72cbef61dab1f5f00f96631cb710e664a49e8c4fa66f')
api = vk.API(session, oauth=1, v='5.35', lang='ru', timeout=10)
print(api.messages.getConversations())
messages = api.messages
last = messages['items'][0]['id']

while True:
    try:
        messages = api.messages.get(last_message_id=last)

    except Exception as e:
        print('error')
    sleep(2)



