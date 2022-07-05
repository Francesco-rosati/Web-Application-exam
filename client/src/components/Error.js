import { useNavigate } from 'react-router-dom';
import { Button, Row, Container } from 'react-bootstrap';

function Error(props) {

    const navigate = useNavigate();

    return (
        <>
            <Container fluid>
                <Row>
                    <h1 align="center" className='mt-4'>Page not found!</h1>
                </Row>
                <Row>
                    <h3 align="center">Click to return on the home page</h3>
                </Row>
                <Row align="center">
                    <Button variant="warning" className="not-found-button mt-4" size="lg" type="button" onClick={() => navigate("/")}>RETURN</Button>
                </Row>
            </Container>
        </>
    );
}

export default Error;