const express = require("express");
const app = express();
// const http = require("http");
const port = 3004;
const mysql = require('./connection').conn

// Configuration
app.set("view engine", "hbs");
app.set("views", "./view");
app.use(express.static(__dirname + "/public"));

// Routing 
app.get("/", (req, res) => {
    // res.send("Hello Brijesh")  // html file
    res.render("index")
});

app.get("/add", (req, res) => {
    res.render("add")
});
app.get("/search", (req, res) => {
    res.render("search")
});
app.get("/update", (req, res) => {
    res.render("update")
});
app.get("/delete", (req, res) => {
    res.render("delete")
});
app.get("/view", (req, res) => {
    let qry = "SELECT * FROM mytable";
    mysql.query(qry, (err, results) => {
        if(err) throw err
        else{
            res.render("view", {data: results});
        }
    });
});

app.get("/addstudent", (req, res) => {
    // res.send("Adding data....");
    // Fetching data from the form
    // res.send(req.query);
    const {name, phone, email, gender} = req.query

    //Sanitization XSS...

    let qry = "SELECT * FROM mytable where email=? or phone=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if(err)
            throw err
        else{
            if(results.length > 0){
                res.render("add", {checkmesg: true});
            } else{
                // Insert query
                let qry2 ="Insert into mytable values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {
                    if(results.affectedRows > 0){
                        res.render("add", {mesg: true});
                    }
                });
            }
        }    
    });
});

app.get("/searchstudent", (req, res) => {
    // Fetch data from the form
    const {phone} = req.query;

    let qry = "select * from mytable where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if(err) throw err
        else{
            if(results.length > 0) {
                res.render("search", {mesg1: true, mesg2:false});
            }else{
                res.render("search", {mesg1: false, mesg2: true});
            }
        }
    });
});

app.get("/updatesearch", (req, res) => {
     // Fetch data from the form
     const {phone} = req.query;

     let qry = "select * from mytable where phone=?";
     mysql.query(qry, [phone], (err, results) => {
         if(err) throw err
         else{
             if(results.length > 0) {
                 res.render("update", {mesg1: true, mesg2:false, data: results});
             }else{
                 res.render("update", {mesg1: false, mesg2: true});
             }
         }
     });
});

app.get("/updatestudent", (req, res) => {
    // fetch data

    const {name, phone, gender} = req.query;
    let qry = "update mytable set name=?, gender=? where phone=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if(err) throw err
        else{
            if(results.affectedRows > 0){
                res.render("update", {umesg: true});
            }
        }
    });
});

app.get("/removestudent", (req, res) => {
    // fetch data
    const {phone} = req.query;

     let qry = "delete from mytable where phone=?";
     mysql.query(qry, [phone], (err, results) => {
         if(err) throw err
         else{
             if(results.length > 0) {
                 res.render("delete", {mesg1: true, mesg2: false});
             }else{
                 res.render("delete", {mesg1: false, mesg2: true});
             }
         }
     });
})

// Create server
/*
const server = http.createServer((req, res) => {
    res.end("Hello");
});
*/
app.listen(port, /* "0.0.0.0", */ (err) => {
    if(err)
        throw err
    else
        console.log("Server is running at port %d:", port);    
});