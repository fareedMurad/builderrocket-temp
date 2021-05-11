import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { loginEmailPassword } from '../../actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash'
import { getUserProfile } from '../../actions/userActions';

const Login = (props) => {
    const { history } = props;

    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);

    const [login, setLogin] = useState({ email: 'ronbibb@gmail.com' });
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);

        if (!isEmpty(login))
            dispatch(loginEmailPassword(login.email, login.password))
                .then((token) => {
                    if (token)
                        dispatch(getUserProfile(token));

                    setIsLoading(false);

                    history.push('/');
                });
    }

    useEffect(() => {
        if (token) 
            history.push('/');
    })

    return (
        <Row className='justify-content-center pt-5'>
            <Col md={4}>
                <h2>Login</h2>
                <br/>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    value={login?.email}
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
                </div>
            </Col>
        </Row>
    )
}

export default Login;