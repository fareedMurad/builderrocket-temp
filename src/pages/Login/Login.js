import React, { useState } from 'react';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { loginEmailPassword } from '../../actions/authActions';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash'

const Login = (props) => {
    const { history } = props;

    const dispatch = useDispatch();

    const [login, setLogin] = useState({ email: 'ronbibb@gmail.com' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);

        if (!isEmpty(login))
            dispatch(loginEmailPassword(login.email, login.password))
                .then(() => {
                    setIsLoading(false);
                    history.push('/');
                });
    }

    return (
        <Row className='justify-content-center pt-5'>
            <Col md={4}>
                <h2>Login</h2>
                <br/>
                <Form>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Email'
                            value={login?.email}
                            onChange={(e) => setLogin({ ...login, email: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            autoComplete='true'
                            placeholder='Password'
                            onChange={(e) => setLogin({ ...login, password: e.target.value })}
                        />
                    </Form.Group>
                    {isLoading ? 
                        <div className='d-flex justify-content-center'>
                            <Spinner 
                                animation='border'
                                variant='primary' 
                            />
                        </div>
                    :
                        <Button onClick={handleLogin}>Login</Button>
                    }
                </Form>
            </Col>
        </Row>
    )
}

export default Login;