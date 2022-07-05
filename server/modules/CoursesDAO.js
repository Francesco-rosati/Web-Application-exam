class CoursesDAO {

    sqlite = require('sqlite3');

    constructor(db) {
        this.db = db;
    }

    //MAIN TABLE COURSES

    /* The three functions below have been included only out of necessity. They are never called */
    closeCoursesTable() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    newCoursesTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS COURSES(CODE VARCHAR(7) PRIMARY KEY, NAME VARCHAR(100) NOT NULL,CREDITS INTEGER NOT NULL,MAX_STUDENTS INTEGER,PROPAEDEUTICITY VARCHAR(7));";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    dropCoursesTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS COURSES;";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        });
    }

    getAllCourses() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT C.CODE, C.NAME, C.CREDITS, COUNT(SP.CODE) AS CURRENT_STUDENTS, C.MAX_STUDENTS, C.PROPAEDEUTICITY  FROM COURSES C LEFT JOIN STUDY_PLANS SP ON C.CODE = SP.CODE GROUP BY C.CODE ORDER BY C.NAME;";
            this.db.all(sql, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    const courses = data.map((el) => {
                        return {
                            code: el.CODE,
                            name: el.NAME,
                            credits: el.CREDITS,
                            currentStudents: el.CURRENT_STUDENTS,
                            maxStudents: el.MAX_STUDENTS,
                            propaedeuticity: el.PROPAEDEUTICITY
                        }
                    });
                    resolve(courses);
                }
            });
        });
    }

    //TABLE INCOMPATIBILITIES

    /* The three functions below have been included only out of necessity. They are never called */
    closeIncompatibilitiesTable() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    newIncompatibilitiesTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS INCOMPATIBILITIES(COURSE_CODE VARCHAR(7), INCOMPATIBILITY VARCHAR(7),PRIMARY KEY(COURSE_CODE,INCOMPATIBILITY),FOREIGN KEY(COURSE_CODE) REFERENCES COURSES(CODE), FOREIGN KEY(INCOMPATIBILITY) REFERENCES COURSES(CODE));";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    dropIncompatibilitiesTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS INCOMPATIBILITIES;";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        });
    }

    getAllIncompatibilities() {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM INCOMPATIBILITIES;";
            this.db.all(sql, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    const incompatibilities = data.map((el) => {
                        return {
                            code: el.COURSE_CODE,
                            incompatibleCourse: el.INCOMPATIBILITY
                        }
                    });
                    resolve(incompatibilities);
                }
            });
        });
    }

}

module.exports = CoursesDAO;