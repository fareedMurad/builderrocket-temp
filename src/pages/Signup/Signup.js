import React, { useState } from "react";
import { Row, Col, Button, Form, Spinner, Container } from "react-bootstrap";
import { signupEmailPassword } from "../../actions/authActions";
import { useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";

const Signup = (props) => {
  const { history } = props;

  const dispatch = useDispatch();

  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSingup = (event) => {
    setError("");
    event.preventDefault();
    setIsLoading(true);

    if (user.password !== user.confirmPassword) {
      setError("Password and confirm password should be same!");
      setIsLoading(false);
      return;
    }

    const params = {
      zip: user.zip,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      streetAddress1: user.streetAddress1,
      city: user.city,
      userName: "",
      streetAddress2: "",
      state: user.state,
    };

    if (!isEmpty(user))
      dispatch(signupEmailPassword(user))
        .then((response) => {
          setIsLoading(false);
          if (response) {
            history.push("/login");
          } else {
            setError("Please Enter valid email or password!");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setError(error?.response?.data);
        });
  };

  console.log(user, "Hey");
  return (
    <Container className="pt-5" fluid="md">
      <h2>Signup</h2>
      <br />
      <Form onSubmit={handleSingup}>
        <Row className="justify-content-center">
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={user?.firstName}
                required
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={user?.lastName}
                required
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          {/* <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Name"
                value={user?.userName}
                required
                onChange={(e) => setUser({ ...user, userName: e.target.value })}
              />
            </Form.Group>
          </Col> */}
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={user?.email}
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                inputMode="tel"
                placeholder="Phone Number"
                value={user?.phoneNumber}
                required
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                value={user?.city}
                required
                onChange={(e) => setUser({ ...user, city: e.target.value })}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Street Address 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Street Address 1"
                value={user?.streetAddress1}
                required
                onChange={(e) =>
                  setUser({ ...user, streetAddress1: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        {/* <Row className="justify-content-center">
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Street Address 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Street Address 2"
                value={user?.streetAddress2}
                onChange={(e) =>
                  setUser({ ...user, streetAddress2: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row> */}

        <Row className="justify-content-center">
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                placeholder="State"
                value={user?.state}
                required
                onChange={(e) => setUser({ ...user, state: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Zip</Form.Label>
              <Form.Control
                type="text"
                placeholder="Zip Code"
                value={user?.zip}
                required
                onChange={(e) => setUser({ ...user, zip: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={user.password}
                required
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="confirmPassword"
                value={user.confirmPassword}
                required
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-3">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Button type="submit">Sign Up</Button>
          )}
          <div className="d-inline justify-self-end">
            Already have an account?{" "}
            <Link className="d-inline ml-1" to="login">
              Login
            </Link>
          </div>
        </div>
        {error && <small className="text-danger d-block mt-1">{error}</small>}
      </Form>
    </Container>
  );
};

export default Signup;
