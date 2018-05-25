'use strict'

const
    MongoClient = require('mongodb').MongoClient;

const
    mongo_db_url = require('../../config/keys').mongo_db_url;

const
    checkSpaces = require('../utils/regexp_commands').checkSpaces;
    AnswerBuilder = require('../utils/answer_builder');

const
    help_collections_map = {
        'tg': 'tg_help',
        'vk': 'vk_help',
        'fb': 'fb_help',
        'web': 'email_help'
    }

const save_help = function (id, message, platform) {
    message = message.substring(5);
    if (message == '' || checkSpaces.test(message)){
        return AnswerBuilder(id, message, platform).getHelpAnswer();
    }
    else {
        MongoClient.connect(mongo_db_url, function (err, db) {
            if (err) throw err;
            const dbo = db.db("apok");
            const user_message = {id: id, message: message};
            dbo.collection(help_collections_map[platform]).insertOne(user_message, function (err, res) {
                try {
                    if (err) throw err;
                    db.close();
                }
                catch (err) {
                    return AnswerBuilder(id, message, platform).getErrorAnswer()
                }
            });
        });
    }
}

module.exports = save_help;