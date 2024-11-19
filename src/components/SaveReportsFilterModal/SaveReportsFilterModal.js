import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, Modal, Button, Spinner, Row } from "react-bootstrap";
import "./SaveReportsFilterModal.scss";

const SaveReportsFilterModal = ({
  isAdd,
  show,
  handleClose,
  defaultValues = {},
  handleSave,
}) => {
  const [filters, setFilters] = useState(defaultValues);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFilters(defaultValues);
  }, [defaultValues]);

  const handleSaveReports = async () => {
    if (!filters.Name) {
      return alert("Name is Required");
    } else {
      setIsLoading(true);
      await handleSave?.(filters);
      setIsLoading(false);
    }
  };

  const title = !isAdd ? "Add Report" : "Edit Report";

  return (
    <Modal
      centered
      size="md"
      show={show}
      onHide={handleClose}
      className="add-filters-modal"
    >
      <Modal.Body>
        <div className="page-title">{title}</div>

        <Row>
          <Col md={12}>
            <div className="pb-4">
              <Form.Label className=" ">Name*</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                onChange={(e) =>
                  setFilters({ ...filters, Name: e.target.value })
                }
                defaultValue={filters?.Name}
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
                onClick={handleSaveReports}
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

export default SaveReportsFilterModal;
