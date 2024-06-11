import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const ConfirmApproveAllModal = ({
  show,
  text,
  subtext,
  alwaysButtonText,
  confirmButtonText,
  handleClose,
  handleConfirm,
  isRejectModal,
}) => {
  const history = useHistory();

  return (
    <Modal size="md" centered show={show} onHide={handleClose}>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center">
          <h6 className="mb-3">{text}</h6>
          <small className="text-secondary">
            <b className="text-warning">Note That: </b>
            {subtext}
          </small>
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Button variant="link" className="cancel" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(true)}
            className={`primary-gray-btn next-btn ml-3 bg-success ${
              isRejectModal ? "bg-danger" : ""
            }`}
          >
            {alwaysButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            className={`primary-gray-btn next-btn ml-3 bg-success ${
              isRejectModal ? "bg-danger" : ""
            }`}
          >
            {confirmButtonText}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmApproveAllModal;
