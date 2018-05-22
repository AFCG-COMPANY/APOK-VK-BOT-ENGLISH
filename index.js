'use strict';

// Imports dependencies and set up apps
const
    http = require('http'),
    fs = require('fs'),
    request = require('request'),
    express = require('express'),
    body_parser = require('body-parser'),
    app = express().use(body_parser.json()), // creates express http server
    vkBot = require('node-vk-bot').Bot,
    Botgram = require('botgram');


const vk_token = '251d5365d4fa3f8f44fa1a29a95fd8df030a094ebfa6b4d536cefbdab8e438994272e2bd16dd09f21fcbf';
const tg_token = '514641629:AAEF5RPoJmQ8N0WjKVakIIJWd7sz85cTIQc';

const Botgram = require('botgram');

const { TELEGRAM_BOT_TOKEN } = process.env;

if (!TELEGRAM_BOT_TOKEN) {
    console.error('Seems like you forgot to pass Telegram Bot Token. I can not proceed...');
    process.exit(1);
}

const bot = new Botgram(TELEGRAM_BOT_TOKEN);

function onMessage(msg, reply) {
    figlet(msg.text, (err, data) => {
        if (err) {
            reply.text('An error occured. Probably text format is not correct.').then();
            return;
        }
        const markdownResult = `${'```\n'}${data}${'\n```'}`;
        reply.markdown(markdownResult).then();
        var stream = fs.createReadStream("./package.json");
        reply.document(stream, "My drawing").then(function (err, sentMessage) {
            // sentMessage is a Message object with a file property, just like other photo messages
            console.log("The ID is:", sentMessage.file.id);
        });
    });
}

bot.text(onMessage);

const VKbot = new vkBot({
    token: vk_token
}).start();


VKbot.get(/[\s\S]*/, function answer(msg) {
    var vk_id = (msg.peer_id).toString();
    console.log('hello vk');
    VKbot.send('hello', msg.peer_id)
})


const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Get the webhook event. entry.messaging is an array, but
            // will only ever contain one event, so we get index 0
            let webhook_event = entry.messaging[0];

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {

    /** UPDATE YOUR VERIFY TOKEN **/
    const VERIFY_TOKEN = "DogLover49";

    // Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token) {

        // Check the mode and token sent are correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Respond with 200 OK and challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {
    let response;

    // Check if the message contains text
    if (received_message.text) {

        // Create the payload for a basic text message
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        //"message": response
        "message": {
            "attachment": {
                "type": "file",
                "payload": {
                    "url": "https://cdn.glitch.com/849348ca-1335-44cf-a816-911218a16e0c%2FHL-academy.pdf?1526750869020"
                }
            }
        }
    }
    console.log(request_body);
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

