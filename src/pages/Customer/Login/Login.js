import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";
import { loginEmailPassword } from "../../../actions/customerActions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import ConfirmLogoutModal from "../../../components/ConfirmLogoutModal";
import { logout } from "../../../actions/authActions";

const Login = (props) => {
  const { history } = props;

  const dispatch = useDispatch();
  let inviteID = useSelector((state) => state.customer.inviteID);

  const [login, setLogin] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  useEffect(() => {
    if (isSignedIn) {
      setLogoutModalVisible(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);

    if (!isEmpty(login))
      dispatch(loginEmailPassword(login.email, login.password)).then(
        (response) => {
          setIsLoading(false);
          if (response) {
            if (response?.message)
              setError(
                response?.message ||
                  "Something went wrong!, Please Enter valid email or password!"
              );
            else history.push("/customer/project/documents");
          } else {
            setError("Please Enter valid email or password!");
          }
        }
      );
  };

  const handleLogout = () => {
    const customerDetails = {
      customerPortal: true,
    };
    dispatch(logout(customerDetails)).then(() => {
      setLogoutModalVisible(false);
    });
  };

  return (
    <Row className="justify-content-center pt-5">
      <Col sm={10} md={6} lg={6} xl={4}>
        <h2>Customer Login</h2>
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
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
          </Form.Group>
          <div className="d-flex justify-content-between mt-3">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
            <div className="d-inline justify-self-end">
              Create a new account{" "}
              <Link
                className="d-inline ml-1"
                to={`/customer/signup/${inviteID}`}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </Form>
        {error && <small className="text-danger">{error}</small>}
      </Col>

      <ConfirmLogoutModal
        show={logoutModalVisible}
        setShow={setLogoutModalVisible}
        handleConfirm={handleLogout}
      />
    </Row>
  );
};

export default Login;
