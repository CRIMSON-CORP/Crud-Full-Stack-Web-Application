const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSOWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

conn.connect((err) => {
    if (err) throw err.message;
    console.log(conn.state + " to database ");
});
let instance = null;

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
            console.log(err);
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
            const response = await new Promise((resolve, reject) => {
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
            const response = await new Promise((resolve, reject) => {
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
                const query = "SELECT * FROM data WHERE NAME = ?";
                conn.query(query, [search_key], (err, results) => {
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
