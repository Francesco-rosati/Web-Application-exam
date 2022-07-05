'use strict';

const sqlite = require("sqlite3");

const db = new sqlite.Database('PDS.sqlite', (err) => {
    if(err){
        throw err;
    };
});

const StudentsDAO = require('./StudentsDAO');
const CoursesDAO = require('./CoursesDAO');
const StudyPlanDAO = require('./StudyPlanDAO');

const student_DAO = new StudentsDAO(db);
const courses_DAO = new CoursesDAO(db);
const study_plan_DAO = new StudyPlanDAO(db);

module.exports = {student_DAO, courses_DAO, study_plan_DAO};