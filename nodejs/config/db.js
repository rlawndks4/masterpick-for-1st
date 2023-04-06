const mysql = require('mysql')

const db = mysql.createConnection({
    host : "localhost",
    user : 'root',
    password : 'password',
    port : 3306,
    database:'masterpick',
    timezone: 'Asia/Seoul',
    charset: 'utf8mb4'
})
db.connect();

module.exports = db;