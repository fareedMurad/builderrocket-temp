import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const ConfirmRequiresApprovalModal = ({
  show,
  room,
  handleClose,
  handleConfirm,
  isChecked,
}) => {
  const history = useHistory();

  return (
    <Modal size="md" centered show={show} backdrop>
      <Modal.Body>
        <div className="">
          Are you sure? you want to {isChecked ? "deselect" : "select"} all
          products for approval in <b>{room}</b> room?
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Button
            variant="link"
            className="cancel"
            onClick={() => handleClose()}
          >
            Close
          </Button>
          <Button
            onClick={() => handleConfirm()}
            className="primary-gray-btn next-btn ml-3"
          >
            Confirm
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmRequiresApprovalModal;
