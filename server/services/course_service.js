class CourseService {

    dao;
    studentDB;

    constructor(dao) {
        this.dao = dao;
    }

    //COURSES FUNCTIONS ----------------------------------------

    getCourses = async () => {
        try {
            const courses = await this.dao.getAllCourses();
            return courses;
        }
        catch (err) {
            return 500;
        }
    }

    //INCOMPATIBILITIES FUNCTIONS ----------------------------------------

    getIncompatibilities = async () => {
        try {
            const incompatibilities = await this.dao.getAllIncompatibilities();
            return incompatibilities;
        }
        catch (err) {
            return 500;
        }
    }

}

module.exports = CourseService;