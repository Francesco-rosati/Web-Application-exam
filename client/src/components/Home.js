import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import StudyPlanNavbar from './Navbar';
import Courses from './Courses';
import StudyPlan from './StudyPlan';

function Home(props) {

    const [tempStudyPlan, setTempStudyPlan] = useState([]);

    function addTempCourse(course) {
        setTempStudyPlan(tempStudyPlan.concat(course).sort((a, b) => {
            const name1 = a.name.toUpperCase();
            const name2 = b.name.toUpperCase();

            if (name1 < name2) {
                return -1;
            }
            else if (name1 > name2) {
                return 1;
            }
            else {
                return 0;
            }

        }));
    }

    function deleteTempCourse(course) {

        const foundProp = props.courses.filter(el => (tempStudyPlan.map(element => element.code).includes(el.code) && el.code !== course.code))
            .filter(el => el.propaedeuticity !== null)
            .find(el => el.propaedeuticity === course.code);

        if (foundProp !== undefined) {
            props.setError({ state: true, message: "You cannot delete this course because it is a propaedeuticity for " + foundProp.name + "!" });
            return;
        }

        setTempStudyPlan(tempStudyPlan.filter((el) => el.code !== course.code));
        props.setCurrentCFU((oldCFU) => oldCFU - course.credits);
    }

    return (
        <>
            <StudyPlanNavbar loggedIn={props.loggedIn} loginPage={false} student={props.student} doLogOut={props.doLogOut} />
            <Container fluid>
                {props.loggedIn ? <StudyPlan
                    loggedIn={props.loggedIn}
                    loading={props.loading}
                    studyPlan={props.studyPlan}
                    tempStudyPlan={tempStudyPlan}
                    setTempStudyPlan={setTempStudyPlan}
                    deleteTempCourse={deleteTempCourse}
                    editMode={props.editMode}
                    setEditMode={props.setEditMode}
                    typeOfPlan={props.typeOfPlan}
                    setTypeOfPlan={props.setTypeOfPlan}
                    currentCFU={props.currentCFU}
                    setCurrentCFU={props.setCurrentCFU}
                    saveNewStudyPlan={props.saveNewStudyPlan}
                    deleteAllStudyPlan={props.deleteAllStudyPlan} /> : false}
                <Courses
                    courses={props.courses}
                    tempStudyPlan={tempStudyPlan}
                    setTempStudyPlan={setTempStudyPlan}
                    studyPlan={props.studyPlan}
                    addTempCourse={addTempCourse}
                    loading={props.loading}
                    incompatibilities={props.incompatibilities}
                    editMode={props.editMode}
                    typeOfPlan={props.typeOfPlan}
                    currentCFU={props.currentCFU}
                    setCurrentCFU={props.setCurrentCFU} />
            </Container>
        </>
    );

}

export default Home;