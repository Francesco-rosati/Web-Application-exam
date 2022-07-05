import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Button, Nav } from 'react-bootstrap';
import { PersonCircle, BookFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { LogoutButton } from './LoginComponents';

function StudyPlanNavbar(props) {

    const navigate = useNavigate();

    return (

        <Navbar bg="warning" variant="dark">

            <Container fluid>

                <Navbar.Brand onClick={() => { if (!props.loggedIn) navigate("/") }}>
                    <BookFill color='black' size={35} />
                    {' '}
                    <span className='nav-brand'>StudyPlan</span>
                </Navbar.Brand>

                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Item>
                            {(props.loggedIn && props.student !== {}) ? <LogoutButton logout={props.doLogOut} student={props.student} /> : false}
                        </Nav.Item>
                        <Nav.Item>
                            {(props.loggedIn && props.student !== {}) ? <PersonCircle color="black" size={35} className="ms-2" /> : false}
                        </Nav.Item>
                        <Nav.Item>
                            {(!props.loggedIn && props.loginPage === false) ? <Button variant="outline-dark" onClick={() => navigate("/login")}>Login</Button> : false}
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

export default StudyPlanNavbar;