import { Row, Spinner } from 'react-bootstrap';

function SpinnerBox(props) {
    const { small } = props;

    return (
        <Row className={`${small ? "pb-1" : "p-5"} mt-5 d-flex justify-content-center`}>
            <h2 className='spinner-label'>Loading...</h2>
            <Spinner className='mt-4' animation="border" role="status" />
        </Row>
    );
}

export default SpinnerBox;