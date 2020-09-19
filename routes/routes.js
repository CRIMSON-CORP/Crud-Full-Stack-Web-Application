const express = require("express");
const bodyParser = require("body-parser");
const database = require("../db/database");

const route = express.Router();

// body parser Middle-ware
route.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
route.use(bodyParser.json());
route.get("/test", (req, res) => {
    const db = database.getDbServiceInstance();
    const result = db.getallData();

    result
        .then((data) =>
            res.json({
                data: data,
            })
        )
        .catch((err) => console.log(err));
});
route.post("/insert", (req, res) => {
    const db = database.getDbServiceInstance();
    const { name } = req.body;
    const { age } = req.body;
    const result = db.insertNew(name, age);

    result
        .then((data) =>
            res.json({
                data: data,
            })
        )
        .catch((err) => console.log(err));
});

route.delete("/delete/:id", (req, res) => {
    const db = database.getDbServiceInstance();
    db.deleteRow(req.params.id);
    var response = db.getallData();

    response
        .then((data) =>
            res.json({
                data: data,
            })
        )
        .catch((err) => console.log(err));
});

route.post("/edit/:id", (req, res) => {
    const db = database.getDbServiceInstance();
    const newName = req.body.newName;
    const newAge = req.body.newAge;

    db.editRow(req.params.id, newName, newAge);

    var response = db.getallData();

    response
        .then((data) =>
            res.json({
                data: data,
            })
        )
        .catch((err) => console.log(err));
});

route.get("/search/:search_key", (req, res) => {
    const db = database.getDbServiceInstance();
    const search_key = req.params.search_key;
    const result = db.searchRow(search_key);

    result;
    result
        .then((data) =>
            res
                .json({
                    data: data,
                })
                .then((data) => console.log(data))
        )
        .catch((err) => console.log(err));
});

module.exports = route;
