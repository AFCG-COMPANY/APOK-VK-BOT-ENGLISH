var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://fedor.a.hope:MGTA2019@ds217560.mlab.com:17560/apok";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    db.close();
});