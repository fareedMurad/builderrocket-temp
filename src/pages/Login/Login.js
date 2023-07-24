import React, { useState } from 'react';
import { Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { loginEmailPassword } from '../../actions/authActions';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom';

const Login = (props) => {
  const { history } = props;

  const dispatch = useDispatch();

  const [login, setLogin] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    if (!isEmpty(login))
      dispatch(loginEmailPassword(login.email, login.password)).then(
        (response) => {
          setIsLoading(false);
          if (response) {
            history.push("/");
          } else {
            setError("Please Enter valid email or password!");
          }
        }
      );
  };

  return (
    <Row className="justify-content-center pt-5">
      <Col sm={10} md={6} lg={6} xl={4}>
        <h2>Login</h2>
        <br />
        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={login?.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              autoComplete="true"
              placeholder="Password"
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
            <div className='d-inline justify-self-end'>
              Create a new account <Link className='d-inline ml-1' to="/signup">Sign Up</Link>
            </div>
          </div>
        </Form>
        {error && <small className="text-danger">{error}</small>}
      </Col>
    </Row>
  );
}

export default Login;
