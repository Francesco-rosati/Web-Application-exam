class StudyPlanDAO {

    sqlite = require('sqlite3');

    constructor(db) {
        this.db = db;
    }

    //JOIN TABLE STUDY_PLANS

    /* The three functions below have been included only out of necessity. They are never called */
    closeStudyPlansTable() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    newStudyPlansTable() {
        return new Promise((resolve, reject) => {
            const sql = "CREATE TABLE IF NOT EXISTS STUDY_PLANS(CODE VARCHAR(7), ID INTEGER, PRIMARY KEY(CODE, ID), FOREIGN KEY(CODE) REFERENCES COURSES(CODE), FOREIGN KEY(ID) REFERENCES STUDENTS(ID));";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    dropStudyPlansTable() {
        return new Promise((resolve, reject) => {
            const sql = "DROP TABLE IF EXISTS STUDY_PLANS;";
            this.db.run(sql, function (err) {
                if (err) {
                    reject(err);
                }
                resolve(true);
            })
        });
    }

    getCoursesStudentByStudentId(id) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT C.CODE, C.NAME, C.CREDITS, C.PROPAEDEUTICITY FROM STUDY_PLANS SP, COURSES C WHERE SP.CODE = C.CODE AND ID = ? ORDER BY C.NAME;";
            this.db.all(sql, [id], function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    const courses_student = data.map((el) => {
                        return {
                            code: el.CODE,
                            name: el.NAME,
                            credits: el.CREDITS,
                            propaedeuticity: el.PROPAEDEUTICITY
                        }
                    });
                    resolve(courses_student);
                }
            });
        });
    }

    storeCourseStudent(course_code, id_student) {
        return new Promise((resolve, reject) => {
            const sql = "INSERT INTO STUDY_PLANS(CODE,ID) VALUES (?,?)";
            this.db.run(sql, [course_code, id_student], function (err) {
                if (err) {
                    reject(err);
                }
                resolve(this.lastID);
            });
        });
    }

    deleteAllCoursesStudent(id) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM STUDY_PLANS WHERE ID = ?;";
            this.db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
        })
    }

}

module.exports = StudyPlanDAO;