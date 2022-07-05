class StudyPlanService {

    dao;
    studentDB;
    coursesDB;

    constructor(dao, studentDB, coursesDB) {
        this.dao = dao;
        this.studentDB = studentDB;
        this.coursesDB = coursesDB;
    }

    //STUDY_PLANS FUNCTIONS ----------------------------------------

    getCoursesStudentByStudentId = async (id) => {
        try {

            const student = await this.studentDB.getStudentById(id);

            if (student === undefined) {
                return 404;
            }

            const courses = await this.dao.getCoursesStudentByStudentId(id);

            const courses_student = { courses: courses, type: student.ft };

            return courses_student;
        }
        catch (err) {
            return 500;
        }
    }

    setCourseStudent = async (course_codes, id_student, type) => {

        try {

            const courses = await this.coursesDB.getAllCourses();
            const incompatibilities = await this.coursesDB.getAllIncompatibilities();
            const prevStudyPlan = await this.dao.getCoursesStudentByStudentId(id_student);

            const coursesMax = courses.filter(el => course_codes.includes(el.code))
                .filter(el => el.maxStudents !== null)
                .map(el => {
                    if (prevStudyPlan.length !== 0 && prevStudyPlan.map(el => el.code).includes(el.code)) {
                        return { currentStudents: (el.currentStudents - 1), maxStudents: el.maxStudents };
                    }
                    return { currentStudents: el.currentStudents, maxStudents: el.maxStudents };
                })
            .filter(el => ((el.currentStudents + 1) > el.maxStudents));

            const numCredits = courses.filter(el => course_codes.includes(el.code))
                .reduce((acc, currValue) => acc + currValue.credits, 0);

            const propaedeuticities = courses.filter(el => course_codes.includes(el.code))
                .filter(el => el.propaedeuticity !== null)
                .map(el => el.propaedeuticity);

            let student = await this.studentDB.getStudentById(id_student);
            let studentUpdated = true;

            if (student === undefined) {
                return "c404";
            }

            //Back-end controls on study plan save

            //Control on credits
            if ((type === 1 && (numCredits < 40 || numCredits > 80)) || (type === 0 && (numCredits < 20 || numCredits > 40))) {
                return "c422";
            }

            //Control on max students
            if (coursesMax.length !== 0) {
                return "c422";
            }

            //Control on propaedeuticity
            for (let el of propaedeuticities) {
                if (!course_codes.includes(el)) {
                    return "c422";
                }
            }

            //Control on incompatibilities
            for (let el of course_codes) {
                const currentInc = incompatibilities.filter(inc => inc.code === el).map(inc => inc.incompatibleCourse);
                for (let inc of currentInc) {
                    if (course_codes.includes(inc)) {
                        return "c422";
                    }
                }
            }

            //Controls passed, i can store the new study plan on the database
            if (student.ft === null) {
                studentUpdated = await this.studentDB.updateStudentFT(type, id_student);
            }

            const deleted = await this.dao.deleteAllCoursesStudent(id_student);

            if (deleted && studentUpdated) {
                for (let i = 0; i < course_codes.length; i++) {
                    await this.dao.storeCourseStudent(course_codes[i], id_student);
                }
            }

            return true;

        }
        catch (err) {
            return "c503";
        }

    }

    deleteAllCoursesStudent = async (id) => {
        try {
            const student = await this.studentDB.getStudentById(id);

            if (student === undefined) {
                return 404;
            }

            const result = await this.dao.deleteAllCoursesStudent(id);

            if (result) {
                await this.studentDB.updateStudentFT(null, id);
            }

            return result;

        }
        catch (err) {
            return 503;
        }
    }

}

module.exports = StudyPlanService;