import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const ConfirmApproveAllModal = ({ show, text,handleClose, handleConfirm }) => {
  const history = useHistory();

  return (
    <Modal size="md" centered show={show} onHide={handleClose}>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          {text}
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Button
            variant="link"
            className="cancel"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="primary-gray-btn next-btn ml-3"
          >
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmApproveAllModal;
