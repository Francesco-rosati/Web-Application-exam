import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Table, Card, ListGroup, Popover, OverlayTrigger } from 'react-bootstrap';
import { CaretUpSquareFill, CaretDownSquareFill, PlusCircle, InfoCircle } from 'react-bootstrap-icons'
import SpinnerBox from './SpinnerBox';

function Courses(props) {

    return (
        <>
            <Title loading={props.loading} />
            {!props.loading ?
                <CoursesTable
                    courses={props.courses}
                    tempStudyPlan={props.tempStudyPlan}
                    studyPlan={props.studyPlan.map(el => el.code)}
                    addTempCourse={props.addTempCourse}
                    incompatibilities={props.incompatibilities}
                    editMode={props.editMode}
                    typeOfPlan={props.typeOfPlan}
                    currentCFU={props.currentCFU}
                    setCurrentCFU={props.setCurrentCFU} /> : <SpinnerBox small={true} />}
        </>
    );
}

function Title(props) {
    return (!props.loading ? <h1 className='below-study-plan' id='table-title'>Courses List</h1> : false);
}

function CoursesTable(props) {

    const usefulInformations = props.courses.map((course) => {
        return { code: course.code, name: course.name, credits: course.credits };
    });

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className='text-center'>CODE</th>
                    <th className='text-center'>NAME</th>
                    <th className='text-center'>CREDITS</th>
                    <th className='text-center'>ENROLLED STUDENTS</th>
                    <th className='text-center'>MAX STUDENTS</th>
                    <th className='text-center'>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {props.courses.map((course) => <CourseRow
                    key={course.code}
                    course={course}
                    tempStudyPlan={props.tempStudyPlan}
                    studyPlan={props.studyPlan}
                    addTempCourse={props.addTempCourse}
                    editMode={props.editMode}
                    usInf={usefulInformations}
                    incompatibilities={props.incompatibilities}
                    typeOfPlan={props.typeOfPlan}
                    currentCFU={props.currentCFU}
                    setCurrentCFU={props.setCurrentCFU} />)}
            </tbody>
        </Table>
    );
}

function CourseRow(props) {

    const [selected, setSelected] = useState(false);
    const [statusClass, setStatusClass] = useState(null);
    const [infoMsg, setInfoMsg] = useState("");

    useEffect(() => {

        const isNew = () => {
            if (props.tempStudyPlan.length !== 0) {
                for (let i = 0; i < props.tempStudyPlan.length; i++) {
                    if (props.tempStudyPlan[i].code === props.course.code) {
                        setInfoMsg("This course is already in your study plan!");
                        setStatusClass("table-success");
                        break;
                    }
                }
            }
        }

        const isPropaedeutic = () => {

            if (props.course.propaedeuticity !== null) {

                let found = 0;

                for (let i = 0; i < props.tempStudyPlan.length; i++) {
                    if (props.tempStudyPlan[i].code === props.course.propaedeuticity) {
                        found = 1;
                        break;
                    }
                }

                if (found === 0) {
                    setInfoMsg("In your study plan you must first insert the propaedeutic course!");
                    setStatusClass("table-danger");
                }

            }

        }

        const isIncompatible = () => {

            const courseIncs = props.incompatibilities.filter(el => el.code === props.course.code);

            const currentIncs = props.incompatibilities.filter(el => props.tempStudyPlan.map(element => element.code).includes(el.code))
                .map(el => el.incompatibleCourse);

            let incompatible = false;

            if (props.tempStudyPlan.length !== 0) {
                for (let i = 0; i < props.tempStudyPlan.length; i++) {
                    for (let j = 0; j < courseIncs.length; j++) {
                        if (props.tempStudyPlan[i].code === courseIncs[j].incompatibleCourse) {
                            incompatible = true;
                            break;
                        }
                    }
                }

                if (incompatible || (currentIncs.length !== 0 && currentIncs.includes(props.course.code))) {
                    setInfoMsg("This course is incompatible with a course you have already inserted in your study plan!");
                    setStatusClass("table-danger");
                }

            }
        }

        const isOverCFUs = () => {
            if (props.tempStudyPlan.length !== 0) {
                if ((props.typeOfPlan.type === 1 && (props.currentCFU + props.course.credits > 80)) || (props.typeOfPlan.type === 0 && (props.currentCFU + props.course.credits > 40))) {
                    setInfoMsg("This course cannot be added because you will exceed the maximum credit threshold!");
                    setStatusClass("table-danger");
                }

            }
        }

        const isOverMax = () => {

            if (props.course.maxStudents !== null) {

                /* 
                If the previous study plan already contained this course, the student in edit mode,
                can take it out and put it back in as many times as he wants, since he was already counted
                in the enrolled students for that course.
                */

                if (props.studyPlan.length === 0 || (props.studyPlan.length !== 0 && !props.studyPlan.includes(props.course.code))) {
                    if (props.course.currentStudents === props.course.maxStudents) {
                        setInfoMsg("This course has already reached the maximum number of students!");
                        setStatusClass("table-danger");
                    }
                }
            }
        }

        //The order of the function calls is related to the the priority of the error
        //The higher the priority, the more the function is called after
        if (props.editMode) {
            setStatusClass(null);
            setInfoMsg("");
            isPropaedeutic();
            isIncompatible();
            isOverMax();
            isOverCFUs();
            isNew();
        }

    }, [props.editMode, props.tempStudyPlan.length]);

    return (
        <>
            <tr className={props.editMode ? statusClass : ""}>
                <td align='center'>{props.course.code}</td>
                <td>{props.course.name}</td>
                <td align='center'>{props.course.credits}</td>
                <td align='center'>{props.course.currentStudents}</td>
                <td align='center'>{props.course.maxStudents} </td>
                <td align='center'>{<RowActions selected={selected} setSelected={setSelected} editMode={props.editMode} addTempCourse={props.addTempCourse} course={props.course} setCurrentCFU={props.setCurrentCFU} info={infoMsg} />}</td>
            </tr>
            {selected ? <CourseInfo course={props.course} usInf={props.usInf} incompatibilities={props.incompatibilities.filter(el => el.code === props.course.code)} /> : false}
        </>
    );
}

function RowActions(props) {

    if (props.editMode && props.info === "") {
        if (!props.selected) {
            return (
                <>
                    <CaretDownSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(true)} />
                    <PlusCircle className='add-icon ms-3' size={22} onClick={() => { props.addTempCourse(props.course); props.setCurrentCFU((oldVal) => oldVal + props.course.credits) }} />
                </>
            );
        }
        else {
            return (
                <>
                    <CaretUpSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(false)} />
                    <PlusCircle className='add-icon ms-3' size={22} onClick={() => { props.addTempCourse(props.course); props.setCurrentCFU((oldVal) => oldVal + props.course.credits); }} />
                </>
            )
        }
    }
    else if (props.editMode && props.info !== "") {
        if (!props.selected) {
            return (
                <>
                    <CaretDownSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(true)} />
                    <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Popover id={'popover-positioned-top'} className='popover-layout'>
                                <Popover.Header as="h2" align='center' className='popover-layout'><strong>Info: </strong></Popover.Header>
                                <Popover.Body as="h6">
                                    {props.info}
                                </Popover.Body>
                            </Popover>
                        }>
                        <InfoCircle className='info-icon ms-3' size={22} />
                    </OverlayTrigger>
                </>
            );
        }
        else {
            return (
                <>
                    <CaretUpSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(false)} />
                    <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Popover id={'popover-positioned-top'} className='popover-layout'>
                                <Popover.Header as="h2" align='center' className='popover-layout'><strong>Info: </strong></Popover.Header>
                                <Popover.Body as="h6">
                                    {props.info}
                                </Popover.Body>
                            </Popover>
                        }>
                        <InfoCircle className='info-icon ms-3' size={22} />
                    </OverlayTrigger>
                </>
            )
        }
    }
    else {
        if (!props.selected) {
            return (<CaretDownSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(true)} />);
        }
        else {
            return (<CaretUpSquareFill className='caret-icons' size={22} onClick={() => props.setSelected(false)} />)
        }
    }

}

function CourseInfo(props) {

    return (
        <>
            <tr>
                <td colSpan={6}>
                    <Card border="success">
                        <Card.Header className="card-header">Propaedeutic course</Card.Header>
                        <Card.Body>
                            {props.course.propaedeuticity === null ?
                                <Card.Text>
                                    This course doesn't have a propaedeutic course!
                                </Card.Text> : props.usInf.filter((el) => el.code === props.course.propaedeuticity).map((el) => <Card.Text key={el.code}><b>Code: </b>{el.code} <b>Name: </b>{el.name} <b>Credits: </b>{el.credits}</Card.Text>)}
                        </Card.Body>
                    </Card>
                </td>
            </tr>
            <tr>
                <td colSpan={6}>
                    <Card border="danger">
                        <Card.Header className="card-header">Incompatible courses</Card.Header>
                        <Card.Body>
                            {props.incompatibilities.length === 0 ?
                                <Card.Text>
                                    This course doesn't have incompatible courses!
                                </Card.Text> :
                                <ListGroup as="ol" numbered variant="flush">
                                    {props.incompatibilities.map((el) => props.usInf.filter((element) => el.incompatibleCourse === element.code).map((element) => <ListGroup.Item as="li" key={el.incompatibleCourse}><b>Code: </b>{element.code} <b> Name: </b>{element.name}<b> Credits: </b>{element.credits}</ListGroup.Item>))}
                                </ListGroup>
                            }
                        </Card.Body>
                    </Card>
                </td>
            </tr>
        </>
    );
}

export default Courses;