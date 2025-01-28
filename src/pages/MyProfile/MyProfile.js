import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Container,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../assets/images/male-placeholder-image.jpeg";
import CustomLightbox from "../../components/Lightbox";

import { updateUserProfile } from "../../actions/userActions";

const MyProfile = (props) => {
  const { history } = props;
  const dispatch = useDispatch();
  const inputFile = useRef();

  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [readOnlyfield, seReadOnlyfield] = useState(true);
  const userDetails = useSelector((state) => state.user.user);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    setUser(userDetails);
    setProfileImage({ URL: userDetails?.ThumbnailURL });
  }, [userDetails]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(updateUserProfile(user)).then((response) => {
      setIsLoading(false);
    });
  };
  const browse = () => {
    // clicks file upload input through button
    inputFile.current.click();
  };

  const onFileChange = (event) => {
    const file = event.target?.files?.[0];
    setUser({ ...user, File: file });
    setProfileImage({
      URL: URL.createObjectURL(file),
      Image: file,
    });
  };

  return (
    <Container className="pt-5" fluid="md">
      <h2>My Account</h2>
      <br />
      <Row className="mb-3 position-relative">
        {isLoading ? (
          <div
            className="spinner d-flex align-items-center justify-content-center"
            style={{
              zIndex: 9999999,
              position: "fixed",
              width: "100vw",
              height: "100vh",
              top: 1,
              left: 0,
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <Spinner animation="border" variant="primary" className="mb-3" />
          </div>
        ) : null}
        <Col xs={12} md={4} className="text-center">
          <div
            style={{ width: "250px", height: "250px" }}
            className="mx-auto position-relative"
          >
            <CustomLightbox
              size={250}
              images={[profileImage?.URL ? profileImage.URL : Avatar]}
              singleImageProps={{
                className: "rounded-circle pointer",
                style: { objectFit: "contain" },
              }}
            />
          </div>
          {!readOnlyfield ? (
            <div className="mt-2">
              {profileImage?.URL ? (
                <Button variant="danger" size="sm">
                  Remove
                </Button>
              ) : null}
              <Button
                variant="primary"
                size="sm"
                className="ml-2"
                onClick={browse}
              >
                {profileImage?.URL ? "Change Profile" : "Upload Profile"}
              </Button>
              <input
                hidden
                type="file"
                ref={inputFile}
                onChange={onFileChange}
              />
            </div>
          ) : null}
        </Col>
        <Col xs={12} md={8}>
          <Form onSubmit={handleUpdate}>
            <Row>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">First Name</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="First Name"
                    value={user?.FirstName}
                    required
                    autoFocus
                    onChange={(e) =>
                      setUser({ ...user, FirstName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Last Name</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="Last Name"
                    value={user?.LastName}
                    required
                    onChange={(e) =>
                      setUser({ ...user, LastName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">User Name</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="User Name"
                    value={user?.UserName}
                    required
                    onChange={(e) =>
                      setUser({ ...user, UserName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Company</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="Company"
                    value={user?.Company}
                    required
                    onChange={(e) =>
                      setUser({ ...user, Company: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Email</Form.Label>
                  <Form.Control
                    disabled
                    type="email"
                    placeholder="Email"
                    value={user?.Email}
                    required
                    onChange={(e) =>
                      setUser({ ...user, Email: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Phone</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    inputMode="tel"
                    placeholder="Phone Number"
                    value={user?.PhoneNumber}
                    required
                    onChange={(e) =>
                      setUser({ ...user, PhoneNumber: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Street Address 1</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="Street Address 1"
                    value={user?.StreetAddress1}
                    required
                    onChange={(e) =>
                      setUser({ ...user, StreetAddress1: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Street Address 2</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="Street Address 2"
                    value={user?.StreetAddress2}
                    required
                    onChange={(e) =>
                      setUser({ ...user, StreetAddress2: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">City</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="City"
                    value={user?.City}
                    required
                    onChange={(e) => setUser({ ...user, City: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">State</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="State"
                    value={user?.State}
                    required
                    onChange={(e) =>
                      setUser({ ...user, State: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label className="mt-3">Zip</Form.Label>
                  <Form.Control
                    disabled={readOnlyfield}
                    type="text"
                    placeholder="Zip Code"
                    autoComplete="zip-code"
                    value={user?.Zip}
                    required
                    onChange={(e) => setUser({ ...user, Zip: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4">
              {error ? <p className="text-danger">{error}</p> : null}
              {readOnlyfield ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    seReadOnlyfield(false);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <OverlayTrigger
                  placement="auto"
                  overlay={
                    <Tooltip id="button-tooltip">
                      Click to save the changes you made, otherwise changes will
                      be lost!
                    </Tooltip>
                  }
                  delay={{ show: 250, hide: 400 }}
                >
                  <Button type="submit">Save changes</Button>
                </OverlayTrigger>
              )}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MyProfile;
