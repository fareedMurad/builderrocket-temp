import React, { useEffect, useRef, useState } from "react";
import "./Photo.scss";
import {
  Button,
  Card,
  Form,
  Modal,
  Overlay,
  Popover,
  Spinner,
} from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getProjectByProjectID } from "../../actions/projectActions";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../FileUpload";
import { addDocument, deleteDocument } from "../../actions/documentActions";
import CustomLightbox from "../Lightbox";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const DocumentTypeID = 19;
const PhotosTab = () => {
  const ref = useRef(null);

  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.project);

  const inputFile = useRef();
  const componentRef = useRef(null);
  const [show, setShow] = useState(false);
  const [uploadFiles, setUploadFiles] = useState({});
  const [Open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(null);
  const [id, setId] = useState("");
  const [progress, setProgress] = useState({
    0: { progress: 100, loading: true },
    1: { progress: -1, loading: true },
  });

  useEffect(() => {
    if (uploadFiles?.length) {
      setShow(true);
      handleSubmit();
    } else {
      setShow(false);
    }
  }, [uploadFiles?.length]);

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
    for (let i = 0; i < uploadFiles?.length; i++) {
      const File = uploadFiles[i];
      console.log(uploadFiles, "uploadFiles");

      progress[i] = { progress: 0, loading: true };
      setProgress({ ...progress });
      const formData = new FormData();
      formData.append("File", File);

      formData.append("DocumentTypeID", DocumentTypeID);

      dispatch(
        addDocument(project.ID, formData, (event) => {
          progress[i] = {
            progress: Math.round((100 * event.loaded) / event.total),
            loading: true,
          };
          setProgress({ ...progress });
        })
      )
        .then(async (response) => {
          if (uploadFiles?.length - 1 === i) {
            await dispatch(getProjectByProjectID(project.ID)).then((res) => {
              handleClose();
            });
          }
          setProgress({ ...progress });
          progress[i] = { progress: 100, loading: false };
        })
        .catch(() => {
          progress[i] = { progress: -1, loading: false };
          setProgress({ ...progress });
          alert("Something is wrong, please try!");
        });
    }
  };

  const handlerDelete = (id, event) => {
    setTarget(event.target);
    setOpen(true);
    setId(id);
  };

  const onFileChange = (event) => {
    setUploadFiles(event.target?.files);
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
    let p = progress[id];

    if (!p) return <></>;

    return (
      <div className="mt-1">
        <ProgressBar
          striped
          variant={
            p?.progress === 100
              ? "success"
              : p?.progress === -1
              ? "danger"
              : "info"
          }
          now={p?.progress}
          label={
            p?.progress === 100
              ? "Completed"
              : p?.progress === -1
              ? "Failed"
              : p?.progress + "%"
          }
        />
      </div>
    );
  };

  const getProjectPhotos = () => {
    return project?.Documents?.filter(
      (p) => p.DocumentTypeID === DocumentTypeID
    );
  };

  const browse = () => {
    // clicks file upload input through button
    inputFile.current.click();
  };
  return (
    <div className="d-flex products">
      <div className="reports-container" ref={componentRef}>
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <div className="page-title">Photos</div>
          </div>
          <div>
            <Button variant="link" className="link-btn" onClick={browse}>
              + Add Photos
            </Button>
            <input
              hidden
              multiple
              type="file"
              id="actual-btn"
              ref={inputFile}
              onChange={onFileChange}
            />
          </div>
        </div>
        <div className="photos-grid">
          {project && getProjectPhotos().length ? (
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                300: 1,
                500: 2,
                700: 3,
                900: 4,
                1300: 5,
              }}
            >
              <Masonry>
                {getProjectPhotos().map((list) => {
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
                      <CustomLightbox
                        images={[list.URL]}
                        singleImageProps={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  );
                })}
              </Masonry>
            </ResponsiveMasonry>
          ) : (
            <></>
          )}
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
      <Modal show={show} centered>
        <Modal.Body>
          <Card>
            <Card.Body>
              <Form.Label>
                Uploading{" "}
                {uploadFiles?.length && (
                  <small>
                    {" "}
                    {uploadFiles.length} File
                    {uploadFiles?.length > 1 ? "s" : ""}
                  </small>
                )}
                {console.log(uploadFiles, progress, "uploadFiles")}
              </Form.Label>

              {Array.from(uploadFiles)?.map((file, i) => (
                <div className="my-2">
                  <img
                    height="50"
                    width="50"
                    alt="my product"
                    className="mr-2"
                    style={{ objectFit: "contain" }}
                    src={URL.createObjectURL(file)}
                  />
                  <small className="ml-2">{file.name}</small>
                  {fileProgress(i)}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PhotosTab;
