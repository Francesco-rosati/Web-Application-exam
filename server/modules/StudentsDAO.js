class StudentsDAO {

    sqlite = require('sqlite3');
    crypto = require('crypto');

    constructor(db) {
        this.db = db;
    }

    /* The three functions below have been included only out of necessity. They are never called */
    closeStudentsTable() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    newStudentsTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS STUDENTS(ID INTEGER PRIMARY KEY AUTOINCREMENT, NAME VARCHAR(50), SURNAME VARCHAR(50), USERNAME VARCHAR(50) NOT NULL, PASSWORD VARCHAR(200) NOT NULL, SALT VARCHAR(16), FT BIT);";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }

    dropUsersTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS STUDENTS";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        });
    }

    getStudentById(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM STUDENTS WHERE ID = ?";
            this.db.get(sql, [id], function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    if (data !== undefined) {
                        const student = {
                            id: data.ID,
                            username: data.USERNAME,
                            name: data.NAME,
                            surname: data.SURNAME,
                            ft: data.FT
                        }
                        resolve(student);
                    }
                    else {
                        resolve(undefined);
                    }
                }
            });
        });
    }

    getStudent = (username, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM STUDENTS WHERE USERNAME = ?;';
            this.db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const student = {
                        id: row.ID,
                        username: row.USERNAME,
                        name: row.NAME, 
                        surname: row.SURNAME
                    }

                    const salt = row.SALT;
                    this.crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                        if (err) {
                            reject(err);
                        };

                        const passwordHex = Buffer.from(row.PASSWORD, 'hex');

                        if (!this.crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                            resolve(false);
                        }
                        else {
                            resolve(student);
                        }
                    });
                }
            });
        });
    };

    updateStudentFT(newFT,id) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE STUDENTS SET FT = ? WHERE ID = ?;";
            this.db.run(sql, [newFT, id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        });
    }

}

module.exports = StudentsDAO;