import React, { useEffect, useRef, useState } from "react";
import "./Photo.scss";
import { Button, Card, Form, Modal, Overlay, Popover, Spinner } from "react-bootstrap";
import { getProjectByProjectID } from "../../actions/projectActions";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../FileUpload";
import { addDocument, deleteDocument } from "../../actions/documentActions";
import CustomLightbox from "../Lightbox";

const DocumentTypeID = 19;
const PhotosTab = () => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);

  const componentRef = useRef(null);
  const [show, setShow] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({});
  const [Open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(null);
  const [id, setId] = useState("");
  const [progress, setProgress] = useState({});

  const handleShow = () => setShow(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await dispatch(getProjectByProjectID(project.ID));
      setLoading(false);
    };
    getData();
  }, [project.ID]);

  const handleClose = () => {
    setShow(false);
    setUploadFiles({});
  };

  const handleSubmit = () => {
    const File = uploadFiles;
    const formData = new FormData();
      formData.append("File", File);

    formData.append("DocumentTypeID", DocumentTypeID);

    dispatch(
      addDocument(project.ID, formData, (event) => {
        progress[DocumentTypeID] = {
          progress: Math.round((100 * event.loaded) / event.total),
          loading: true,
        };
        setProgress({ ...progress });
      })
    )
      .then(async (response) => {
        await dispatch(getProjectByProjectID(project.ID));

        progress[DocumentTypeID] = { progress: 0, loading: false };
        setProgress({ ...progress });
        handleClose();
      })
      .catch(() => {
        progress[DocumentTypeID] = { progress: 0, loading: false };
        setProgress({ ...progress });
        alert("Something is wrong, please try!");
      });
  };

  const handlerDelete = (id, event) => {
    setTarget(event.target);
    setOpen(true);
    setId(id);
  };

  const onFileChange = (documentTypeID, event) => {
    progress[documentTypeID] = { progress: 0, loading: true };
    setProgress({ ...progress });
    setUploadFiles(event.target?.files?.[0]);
  };

  const handlerConfirmDelete = () => {
    setLoading(true);
    dispatch(deleteDocument(id))
      .then(async () => {
        await dispatch(getProjectByProjectID(project.ID));
        setTarget(null);
        setOpen(false);
        setLoading(false);
      })
      .catch(() => {
        alert("Something went wrong uploading Photo try again");
      });
  };

  let fileProgress = (id) => {
    if (!progress) return {};
    return { ...progress[id] };
  };

  const getProjectPhotos = () => {
    return project?.Documents?.filter(p => p.DocumentTypeID === DocumentTypeID);
  }

  return (
    <div className="d-flex products">
      <div className="reports-container" ref={componentRef}>
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <div className="page-title">Photos</div>
          </div>
          <div>
            <Button variant="link" className="link-btn" onClick={handleShow}>
              + Add Photos
            </Button>
          </div>
        </div>
        <div className="photos-grid">
          {project && getProjectPhotos().length
            ? getProjectPhotos().map((list) => {
                return (
                  <div className="item" key={list.ID}>
                    <Button
                      className="btn cut-btn"
                      ref={ref}
                      variant=""
                      onClick={(e) => handlerDelete(list.ID, e)}
                    >
                      <i className="far fa-trash-alt" aria-hidden="true"></i>
                    </Button>
                    <CustomLightbox images={[list.URL]} />
                  </div>
                );
              })
            : false}
        </div>
      </div>
      <Overlay
        show={Open}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
        rootClose={true}
        onHide={() => setOpen(false)}
      >
        <Popover className="photos-popover" id="popover-contained">
          <div>
            <h5 className="text-center">
              Are you sure you want Delete this image?
            </h5>
          </div>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Button
              variant="primary"
              className="po-btn position-static"
              onClick={() => setOpen(false)}
            >
              No
            </Button>
            <Button
              variant="light"
              className="po-btn position-static"
              onClick={handlerConfirmDelete}
            >
             {loading ? (
                <Spinner size="sm" animation="border" variant="primary" />
              ) : (
                "Yes"
              )} 
            </Button>
          </div>
        </Popover>
      </Overlay>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Form.Label>Select Photo</Form.Label>
              <FileUpload
                short
                placeholder={uploadFiles?.name}
                buttonText={"Upload Photo"}
                progress={fileProgress(DocumentTypeID)}
                onFileChange={(event) => onFileChange(DocumentTypeID, event)}
              />
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-center align-items-center gap-2 p-3">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!uploadFiles}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PhotosTab;
