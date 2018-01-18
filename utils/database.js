var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('chinook.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chinook database.');
});
/*
db.run('CREATE TABLE help ( ID integer PRIMARY KEY, message text, userID text, answered integer );');
db.run('SELECT * FROM help');

db.all('SELECT * FROM help', [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});
*/
