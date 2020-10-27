const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

function connectDb() {
    const conn = mysql.createConnection({
        host: "eu-cdbr-west-03.cleardb.net",
        port: 3306,
        user: "bf49b062b62ffb",
        password: "c295ab38",
        database: "heroku_7b86f29a392f3d2",
        database_url:
            "mysql://bf49b062b62ffb:c295ab38@eu-cdbr-west-03.cleardb.net/heroku_7b86f29a392f3d2?reconnect=true",
    });

    conn.connect(function (err) {
        if (err) {
            console.log("error when connecting to db:", err);
            setTimeout(connectDb, 2000);
        } else {
            console.log("connected to DB");
        }
    });

    conn.on("error", function (err) {
        console.log("db error", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            connectDb();
        } else {
            throw err;
        }
    });

    return conn;
}

var conn = connectDb();

let instance = null;

const query = "SELECT * FROM data";
conn.query(query, (err, results) => {
    if (err) throw err;
    console.log(results);
});

class dbservice {
    static getDbServiceInstance() {
        return instance ? instance : new dbservice();
    }
    async getallData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM data";
                conn.query(query, (err, results) => {
                    if (err) throw err;
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNew(name, age) {
        try {
            var date = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO data(NAME, AGE, date)VALUES(?,?,?)";
                conn.query(query, [name, age, date], (err, results) => {
                    if (err) reject();
                    resolve(results.insertId);
                });
            });
            return {
                id: insertId,
                name: name,
                age: age,
                date: date,
            };
        } catch (error) {
            console.log(err);
        }
    }

    async deleteRow(id) {
        try {
            id = parseInt(id, 10);
            await new Promise((resolve, reject) => {
                const query = "DELETE FROM data WHERE ID = ?";
                conn.query(query, [id], (err, results) => {
                    if (err) throw err;
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
    async editRow(id, newName, newAge) {
        try {
            var date = new Date();
            id = parseInt(id, 10);
            await new Promise((resolve, reject) => {
                const query = "UPDATE data set NAME = ?, AGE= ?, date = ? WHERE id = ?";
                conn.query(query, [newName, newAge, date, id], (err, results) => {
                    if (err) throw err;
                    resolve(results);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async searchRow(search_key) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM data WHERE NAME LIKE '%${search_key}%'`;
                conn.query(query, (err, results) => {
                    if (err) reject(err.message);
                    resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = dbservice;
