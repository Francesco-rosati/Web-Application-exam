import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { PersonCircle, KeyFill } from 'react-bootstrap-icons';
import { useState } from 'react';
import '../App.css';
import StudyPlanNavbar from './Navbar';

function LoginPage(props) {

  const [username, setUsername] = useState('u1@p.it');
  const [password, setPassword] = useState('testpassword');

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {

    event.preventDefault();
    const credentials = { username, password };
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      props.login(credentials);
    }

    setValidated(true);

  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
  }

  return (
    <>
      <StudyPlanNavbar student={props.student} loginPage={true}/>
      <Container fluid>
        <Row><h1 className='mt-4 login-title'>STUDY PLAN</h1></Row>
        <Row><h3 className='mt-4 login-title'>Insert your username and password to do the login!</h3></Row>
        <Row>
          <Col></Col>
          <Col>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

              <Form.Group controlId='username'>
                <Form.Label className='mt-4'>Username</Form.Label>{' '}<PersonCircle />
                <Form.Control required type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                <Form.Control.Feedback type='invalid'>Username field is empty or it is not an email!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Label className='mt-2'>Password</Form.Label>{' '}<KeyFill />
                <Form.Control required type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                <Form.Control.Feedback type='invalid'>Password field cannot be empty!</Form.Control.Feedback>
              </Form.Group>

              <Form.Group align="center">
                <Button type='submit' className='mt-4 mx-4' variant='primary'>Login</Button>
                <Button type='button' className='mt-4 mx-4' variant='outline-danger' onClick={() => handleReset()}>Cancel</Button>
              </Form.Group>

            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  )
}

function LogoutButton(props) {

  return (
    <Col>
      <Button variant="outline-dark" className="mx-2" onClick={props.logout}>Logout</Button>{' '}<span>{props.student?.name + " " + props.student?.surname }</span>
    </Col>
  )
}

export { LoginPage, LogoutButton };