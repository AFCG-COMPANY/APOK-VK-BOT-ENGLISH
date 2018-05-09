const MongoClient = require('mongodb').MongoClient;

const mongo_db_url = require('../../config/keys').mongo_db_url;

const help_collectioons_map = {
    'tg': 'tg_help',
    'vk': 'vk_help',
    'web': 'email_help'
    }

const save_help = function (id, message, platform) {
    console.log(id, message, platform);
    console.log(help_collectioons_map[platform]);
    MongoClient.connect(mongo_db_url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("apok");
        const user_message = { id: id, message: message };
        dbo.collection(help_collectioons_map[platform]).insertOne(user_message, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
}

module.exports = save_help;