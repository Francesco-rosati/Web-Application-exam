import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { Trash3Fill } from 'react-bootstrap-icons'
import { useState } from 'react';

function StudyPlan(props) {

    const [isNew, setIsNew] = useState(false);

    return (
        <>
            <StudyPlanTitle loading={props.loading} />
            {((!props.loading && props.studyPlan.length !== 0) || (!props.loading && props.studyPlan.length === 0 && isNew)) ? <InfoStudyPlan typeOfPlan={props.typeOfPlan.type} currentCFU={props.currentCFU} /> : false}
            {(!props.loading && props.studyPlan.length === 0 && !isNew) ? <AlertStudyPlan setTypeOfPlan={props.setTypeOfPlan} setEditMode={props.setEditMode} setIsNew={setIsNew} /> : false}
            {((!props.loading || isNew)) ?
                <>
                    {((props.studyPlan.length !== 0 && !props.editMode) || (props.tempStudyPlan.length !== 0 && props.editMode)) ?<StudyPlanTable studyPlan={props.studyPlan} tempStudyPlan={props.tempStudyPlan} editMode={props.editMode} isNew={isNew} deleteTempCourse={props.deleteTempCourse} /> : false}
                    <Container>
                        <Row>
                            <Col>
                                {(!props.editMode && props.studyPlan.length !== 0) ? <Button className="mt-2" onClick={() => { props.deleteAllStudyPlan(); props.setEditMode(false); props.setTempStudyPlan([]); setIsNew(false);}} variant="outline-danger">Delete study plan</Button> : false}
                            </Col>
                            <Col></Col>
                            <Col align='right'>
                                {(!props.editMode && props.studyPlan.length !== 0) ? <Button className='mt-2' onClick={() => { props.setTempStudyPlan([...props.studyPlan]); props.setEditMode(true); }} variant="primary">Edit study plan</Button> : false}
                                {(props.editMode && props.tempStudyPlan.length !== 0) ? <Button className='mx-4 mt-2' onClick={() => {props.saveNewStudyPlan(props.tempStudyPlan);}} variant="success">Save study plan</Button> : false}
                                {(props.editMode || (props.tempStudyPlan.length === 0 && isNew)) ? <Button className='mt-2' onClick={() => { props.setEditMode(false); props.setTempStudyPlan([]); setIsNew(false); props.setCurrentCFU(props.studyPlan.reduce((acc, currValue) => acc + currValue.credits, 0)); }} variant="danger">Cancel</Button> : false}
                            </Col>
                        </Row>
                    </Container>
                </> : false}
        </>
    );
}

function StudyPlanTitle(props) {
    return (!props.loading ? <h1 className='above-courses-table' id='study-plan-title'>Your Study Plan</h1> : false);
}

function StudyPlanTable(props) {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th className='text-center'>CODE</th>
                    <th className='text-center'>NAME</th>
                    <th className='text-center'>CREDITS</th>
                    {props.editMode ? <th className='text-center'>ACTIONS</th> : false}
                </tr>
            </thead>
            <tbody>
                {(!props.editMode && !props.isNew) ? props.studyPlan.map((row) => <StudyPlanRow row={row} key={row.code} editMode={props.editMode} />) : props.tempStudyPlan.map((row) => <StudyPlanRow row={row} key={row.code} editMode={props.editMode} deleteTempCourse={props.deleteTempCourse} />)}
            </tbody>
        </Table>
    );
}

function StudyPlanRow(props) {

    return (
        <tr>
            <td align='center'>{props.row.code}</td>
            <td>{props.row.name}</td>
            <td align='center'>{props.row.credits}</td>
            {props.editMode ? <td align="center"><Trash3Fill className='delete-icon' size={22} onClick={() => props.deleteTempCourse(props.row)} /></td> : false}
        </tr>
    );
}

function AlertStudyPlan(props) {

    return (
        <Alert variant="info">
            <Alert.Heading>You have not yet defined a study plan</Alert.Heading>
            <h5>
                If you want to define a new study plan, click on one of the two buttons below!
            </h5>
            <hr />
            <div className="d-flex justify-content-end">
                <Button className="mx-4" onClick={() => {props.setTypeOfPlan(Object.assign({}, { type: 1 })); props.setEditMode(true); props.setIsNew(true);}} variant="success">New full time study plan</Button>
                <Button onClick={() => {props.setTypeOfPlan(Object.assign({}, { type: 0 })); props.setEditMode(true); props.setIsNew(true);}} variant="warning">New part time study plan</Button>
            </div>
        </Alert>
    );
}

function InfoStudyPlan(props) {
    if (props.typeOfPlan === 1) {
        return (<Alert variant="dark" className='mb-4'>
            <Alert.Heading className='info-alert-title'>Full-time study plan</Alert.Heading>
            <h6><strong>Min credits: </strong>40 <strong>Max credits: </strong>80</h6>
            <hr />
            <p className='mb-0'><strong>Current credits: </strong>{props.currentCFU}</p>
        </Alert>);
    }
    else if (props.typeOfPlan === 0) {
        return (<Alert variant="dark" className='mb-4'>
            <Alert.Heading className='info-alert-title'>Part-time study plan</Alert.Heading>
            <h5><strong>Min credits: </strong>20 <strong>Max credits: </strong>40</h5>
            <hr />
            <p className='mb-0'><strong>Current credits: </strong>{props.currentCFU}</p>
        </Alert>);
    }
}

export default StudyPlan;