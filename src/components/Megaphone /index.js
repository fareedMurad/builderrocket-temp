import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Form, Col, Button, Row, Spinner } from "react-bootstrap";
import {
  createContractor,
  getContractorTypes,
  setSelectedContractor,
} from "../../actions/contractorActions";
import { isEmpty, uniqueId } from "lodash";
import "./Megaphone.scss";
import FileUpload from "../FileUpload";

const Megaphone = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const selectedContractor = useSelector(
    (state) => state.contractor.contractor
  );
  const contractorTypes = useSelector(
    (state) => state.contractor.contractorTypes
  );

  const [contractor, setContractor] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleSelectedContractor = useCallback(() => {
    // Set selected contractor to component state to edit
    if (!isEmpty(selectedContractor)) {
      const tempContractor = {
        ...selectedContractor,
        ContractorTypes: selectedContractor.ContractorTypes.map(
          (contractorType) => {
            return {
              value: contractorType.ID,
              label: contractorType.Name,
            };
          }
        ),
      };

      setContractor(tempContractor);
    }
  }, [selectedContractor]);

  useEffect(() => {
    handleSelectedContractor();
  }, [handleSelectedContractor]);

  useEffect(() => {
    if (isEmpty(contractorTypes)) dispatch(getContractorTypes());
  }, [dispatch, contractorTypes]);

  const handleSaveContractor = () => {
    if (!contractor.CompanyName) {
      return alert("Company Name is Required");
    } else if (isEmpty(contractor?.ContractorTypes)) {
      return alert("Contractor Types are Required");
    }

    setIsLoading(true);

    // remap contractor types to save properly
    const contractorFinal = {
      ...contractor,
      ContractorTypes: contractor.ContractorTypes?.map((type) => {
        return {
          ID: type.value,
        };
      }),
    };

    dispatch(createContractor(contractorFinal))
      .then(() => {
        dispatch(setSelectedContractor({}));
        setIsLoading(false);
        handleClose();
      })
      .catch(() => {
        setIsLoading(false);
        alert("Something went wrong creating contractor");
      });
  };

  const handleMagaphoneCross = () => {
    handleClose();
  };
  const handleFileChange = (e) => {
    let file = e.target?.files?.[0];
    setSelectedFiles([...selectedFiles, {file, id: uniqueId()}]);
  };

  const handleDeleteAttachment = (file) => {
    setSelectedFiles(prevs => prevs.filter(f => f.id !== file.id));
  }
  console.log(selectedFiles)
  return (
    <Modal
      size="lg"
      centered
      show={show}
      onHide={handleClose}
      className="add-contractor-modal"
    >
      <Modal.Body>
        <div className="magaphone_cross_btn" onClick={handleClose}>
          x
        </div>
        <Row>
          <Col md={12} lg={12}>
            <Form.Group>
              <Form.Label className="input-label">Title</Form.Label>
              <Form.Control
                type="text"
                className="input-gray"
                onChange={(e) =>
                  setContractor({ ...contractor, Address1: e.target.value })
                }
                defaultValue={contractor?.Address1}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="input-label">Description</Form.Label>
              <Form.Control
                rows={4}
                type="text"
                as="textarea"
                className="input-gray"
                onChange={(e) =>
                  setContractor({ ...contractor, Notes: e.target.value })
                }
                defaultValue={contractor?.Notes}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="input-label">Attachments</Form.Label>
              <div className="form-col pb-4">
                <FileUpload
                  className="custom-file-label"
                  onFileChange={handleFileChange}
                />
              </div>
              <div className="d-flex flex-column gap-4">
                {selectedFiles.map((file, index) => (
                  <div className="file-item d-flex justify-content-between gap- text-primary" key={index}>
                    {file.file.name}
                    <span className="pointer mb-2 text-danger" onClick={() => handleDeleteAttachment(file)}>
                        <i className="fa fa-trash" />
                    </span>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center pt-2">
          <>
            <Button
              type="submit"
              onClick={handleMagaphoneCross}
              className="primary-gray-btn next-btn ml-3"
            >
              submit
            </Button>
          </>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Megaphone;
