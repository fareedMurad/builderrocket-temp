import React, { useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { loginEmailPassword } from '../../actions/authActions';
import { useDispatch } from 'react-redux';

const Login = () => {
    const dispatch = useDispatch();

    const [login, setLogin] = useState();

    const handleLogin = () => {
        dispatch(loginEmailPassword(login.email, login.password))
    }

    console.log('LOGIN', login);

    return (
        <Row className='justify-content-center pt-5'>
            <Col md={4}>
                <h2>Login</h2>
                <br/>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    placeholder='Email'
                    type='email'
                    onChange={(e) => setLogin({ ...login, email: e.target.value })}
                />

                <br />

                <Form.Label>Password</Form.Label>
                <Form.Control
                    placeholder='Password'
                    type='password'
                    onChange={(e) => setLogin({ ...login, password: e.target.value })}
                />
                <div className='pt-4'> 
                    <Button onClick={handleLogin}>Login</Button>
                </div>
            </Col>
        </Row>
    )
}

export default Login;