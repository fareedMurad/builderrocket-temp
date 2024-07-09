import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Form, Modal, Button, Spinner, Row } from "react-bootstrap";
import {
  getUtilities,
  createUtility,
  getUtilityTypes,
} from "../../actions/utilityActions";
import { isEmpty } from "lodash";
import "./AddUtility.scss";

const AddUtility = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const selectedUtility = useSelector((state) => state.utility.utility);
  const utilityTypes = useSelector((state) => state.utility.utilityTypes);

  const [utility, setUtility] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectedUtility = useCallback(() => {
    // Set selected utility to component state to edit
    if (!isEmpty(selectedUtility)) {
      setUtility(selectedUtility);
    }
  }, [selectedUtility]);

  useEffect(() => {
    handleSelectedUtility();
  }, [handleSelectedUtility]);

  useEffect(() => {
    dispatch(getUtilityTypes());
  }, [dispatch]);

  const handleCreateUtility = () => {
    if (!utility.CompanyName) {
      return alert("Company Name is Required");
    }
    if (!utility.UtilityTypeID) {
      return alert("Utility Type is Required");
    }

    setIsLoading(true);

    dispatch(createUtility(utility)).then(() => {
      dispatch(getUtilityTypes());
      dispatch(getUtilities());
      setIsLoading(false);
      handleClose();
    });
  };

  const title = isEmpty(utility) ? "Add Utility" : "Edit Utility";

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={handleClose}
      className="add-utility-modal"
    >
      <Modal.Body>
        <div className="page-title">{title}</div>

        <Row>
          <Col md={6}>
            <div className="pb-4">
              <Form.Label className="input-label">Utility Name*</Form.Label>
              <Form.Control
                type="email"
                className="input-gray"
                onChange={(e) =>
                  setUtility({ ...utility, CompanyName: e.target.value })
                }
                defaultValue={utility?.CompanyName}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="pb-2 select">
              <Form.Label className="input-label">Utility Type*</Form.Label>
              <Form.Control
                as="select"
                value={utility?.UtilityTypeID}
                onChange={(e) =>
                  setUtility({
                    ...utility,
                    UtilityTypeID: parseInt(e.target.value),
                  })
                }
              >
                <option></option>
                {utilityTypes?.map((utilityType, index) => (
                  <option key={index} value={utilityType.ID}>
                    {utilityType.Name}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Col>
          <Col md={6}>
            <div className="pb-4">
              <Form.Label className="input-label">Phone*</Form.Label>
              <Form.Control
                type="email"
                className="input-gray"
                onChange={(e) =>
                  setUtility({ ...utility, PhoneNumber: e.target.value })
                }
                defaultValue={utility?.PhoneNumber}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="pb-4">
              <Form.Label className="input-label">Areas served</Form.Label>
              <Form.Control
                type="email"
                className="input-gray"
                onChange={(e) =>
                  setUtility({ ...utility, Region: e.target.value })
                }
                defaultValue={utility?.Region}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="pb-4">
              <Form.Label className="input-label">Email</Form.Label>
              <Form.Control
                type="email"
                className="input-gray"
                onChange={(e) =>
                  setUtility({ ...utility, EmailAddress: e.target.value })
                }
                defaultValue={utility?.EmailAddress}
              />
            </div>
          </Col>
        </Row>

        <div className="d-flex justify-content-center pt-5">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Button variant="link" className="cancel" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateUtility}
                className="primary-gray-btn next-btn ml-3"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddUtility;
