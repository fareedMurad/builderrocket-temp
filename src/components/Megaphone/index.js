import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Col, Button, Row, Spinner, } from "react-bootstrap";
import { uniqueId } from "lodash";
import "./Megaphone.scss";
import FileUpload from "../FileUpload";
import { sendBugs } from "../../actions/bugReportActions";
const Megaphone = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMagaphoneCross = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Type", form.title);
    formData.append("Message", form.description);
    formData.append("URL", window?.location?.href);
    selectedFiles?.forEach(item => {
      formData.append("Attachments[]", item.file);
    })
 
    dispatch(sendBugs(formData)).then(() => {
      setLoading(false);
      handleClose()
    }).catch(() => {
      setLoading(false)
    });
  };
 
  const handleFileChange = (e) => {
    let file = e.target?.files?.[0];
    setSelectedFiles([...selectedFiles, { file, id: uniqueId() }]);
  };

  const handleDeleteAttachment = (file) => {
    setSelectedFiles((prevs) => prevs.filter((f) => f.id !== file.id));
  };
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
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                defaultValue={form?.title}
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
                  setForm({ ...form, description: e.target.value })
                }
                defaultValue={form?.description}
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group>
              <Form.Label className="input-label">Attachments</Form.Label>
              <div className="form-col pb-1">
                <FileUpload
                  className="custom-file-label"
                  onFileChange={handleFileChange}
                />
              </div>
              <div className="d-flex flex-column gap-4">
                {selectedFiles.map((file, index) => (
                  <div
                    className="file-item d-flex justify-content-between text-primary"
                    key={index}
                  >
                    {file.file.name}
                    <span
                      className="pointer mb-2 text-danger"
                      onClick={() => handleDeleteAttachment(file)}
                    >
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
              className="primary-gray-btn next-btn ml-3 px-5"
            >
              {loading ? <Spinner animation="border" variant="white"  size="sm"/> : "Submit" }
            </Button>
          </>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Megaphone;
