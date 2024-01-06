import React from "react";
import { Modal, Button } from "react-bootstrap";

const ClearChangesModal = ({ show, setShow, clearChanges }) => {
  return (
    <Modal size="md" centered show={show} onHide={() => setShow(false)}>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          Are you sure you want to clear changes?
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Button
            variant="link"
            className="cancel"
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => clearChanges()}
            className="primary-gray-btn next-btn ml-3"
          >
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClearChangesModal;
