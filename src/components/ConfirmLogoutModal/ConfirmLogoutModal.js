import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const ClearChangesModal = ({ show, setShow, handleConfirm }) => {
  const history = useHistory();

  return (
    <Modal size="md" centered show={show}>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          You will be Logged out from your builder account, Are you sure?
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Button
            variant="link"
            className="cancel"
            onClick={() => history.goBack()}
          >
            Cancel
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

export default ClearChangesModal;
