const ServerPort = process.env.PORT || 4000;
const dotenv = require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const { errorHandler } = require('./middleware/errorHandler.js');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "carbon_footprint",
  })
db.connect((err)=>{
    if(!err) console.log("DB connection Successfull");
    else { 
        console.log("DB connection failed \n Error:",JSON.stringify(err))
        process.exit(1);
    }
  }) ;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(errorHandler);

app.get("/", (req, res) => {
    res.json("hello");
  });
  
app.get("/carbon_footprint", (req, res) => {
const q = "SELECT * FROM carbon_footprint_table";
db.query(q, (err, data) => {
    if (err) {
    console.log(err);
    return res.json(err);
    }
    return res.json(data);
});
});

app.post("/carbon_footprint", (req, res) => {
    const q = "INSERT INTO carbon_footprint_table (`rank`, `company_name`, `sector`,`peer_group`,`carbon_intensity`,`portfolio_weightage`) VALUES (?)";

    const values = [
        req.body.rank,
        req.body.company_name,
        req.body.sector,
        req.body.peer_group,
        req.body.carbon_intensity,
        req.body.portfolio_weightage,
    ];
// console.log(req.body);
    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/carbon_footprint/:rank", (req, res) => {
const rank = req.params.rank;
const q = " DELETE FROM carbon_footprint_table WHERE (`rank` = ?) ";

db.query(q, [rank], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
});
});

app.put("/carbon_footprint/:rank", (req, res) => {
const rank = req.params.rank;
const q = "UPDATE  `carbon_footprint`.`carbon_footprint_table`  SET  `company_name`= ?, `sector`= ?, `peer_group`= ?,`carbon_intensity`= ?,`portfolio_weightage`= ? WHERE (`rank` = ?)";

const values = [
    req.body.company_name,
    req.body.sector,
    req.body.peer_group,
    req.body.carbon_intensity,
    req.body.portfolio_weightage,
];
// console.log(req.body,rank)
db.query(q, [...values,rank], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
});
});

app.listen(ServerPort, () => console.log(`listening on port ${ServerPort}`));

module.exports = app;
