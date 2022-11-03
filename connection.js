const mysql = require('mysql');
const conn = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "root123",
    database: "biodata",
    port: 3306
});

conn.connect((err) => {
    if(err){
        console.log(err);
    }else{
        var sql="create table if not exists mytable (name varchar(15), phone int(10), email varchar(25), gender varchar(10))";
        conn.query(sql, (err, result) => {
            if(err){
                console.log(err);
            }else{
                console.log("Connected");
            }
        })
    }
});

module.exports.conn = conn;