import React, { useRef, useState } from "react";
import {
  Button,
  Form,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateDocument } from "../../actions/documentActions";
import {
  getProjectByProjectID,
  setSelectedProject,
} from "../../actions/projectActions";
import "./FileUpload.scss";

const FileUpload = (props) => {
  const {
    label,
    short,
    files,
    fileURL,
    buttonText,
    placeholder,
    onFileChange,
    selectedInput,
    setSelectedInput,
    handleDocumentDelete,
    progress,
    hideUpload,
    onUpdateDocument,
    multiple = false,
    hideEdit,
  } = props;

  const dispatch = useDispatch();
  const inputFile = useRef();

  const project = useSelector((state) => state.project.project);

  const [newFileName, setNewFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const browse = () => {
    // clicks file upload input through button
    inputFile.current.click();
  };

  const updateFileName = async (file) => {
    if (!file?.ID) return;

    setIsLoading(true);

    const fileNameObj = {
      ID: file.ID,
      DocumentTypeID: file.DocumentTypeID,
      FileName: file.FileName,
      UserFileName: newFileName,
    };
    if (onUpdateDocument) {
      await onUpdateDocument(newFileName);
      clearInput();
      setIsLoading(false);
    } else {
      dispatch(updateDocument(fileNameObj))
        .then(() => clearInput())
        .then(() => {
          project.Documents = project?.Documents?.map((d) => {
            if (d?.ID === file.ID) {
              return { ...d, UserFileName: newFileName };
            } else return d;
          });
          dispatch(setSelectedProject({ ...project }));
        })
        .then(() => setIsLoading(false))
        .catch(() => {
          alert("Something went wrong updating document name");
          setIsLoading(false);
        });
    }
  };

  const clearInput = () => {
    setNewFileName("");

    setSelectedInput();
  };

  const handleShowInput = (file) => {
    setNewFileName(file.UserFileName || file.name);

    setSelectedInput(file?.ID);
  };

  return (
    <div className="file-upload">
      <div className={`${short && "d-flex justify-content-between"}`}>
        <Form.Label className={`input-label ${short && "label-margin"}`}>
          {label}
        </Form.Label>
        {!hideUpload &&
          (short ? (
            <div className="upload-btn">
              <Button variant="link" className="link-btn" onClick={browse}>
                {buttonText ?? "+ Add File"}
              </Button>
              <input
                // hidden
                type="file"
                id="actual-btn"
                ref={inputFile}
                onChange={(files) => {
                  onFileChange?.(files);
                  inputFile.current.value = null;
                }}
                multiple={multiple}
              />
            </div>
          ) : (
            <label className="custom-file-label">
              <input type="file" onChange={onFileChange} multiple={multiple} />
            </label>
          ))}
      </div>

      {short && (
        <div className="files-container">
          <div className="file-name">
            {placeholder ? (
              <a href={fileURL} target="_blank" rel="noreferrer">
                {placeholder}
              </a>
            ) : null}
          </div>
          {files &&
            files?.map((file, index) => (
              <div key={index} className="d-flex justify-content-between file">
                {selectedInput === file?.ID ? (
                  <>
                    {!isLoading && (
                      <div className="file-input">
                        <Form.Control
                          value={newFileName}
                          onChange={(event) =>
                            setNewFileName(event.target.value)
                          }
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="file-name">
                    <a href={file?.URL} target="_blank" rel="noreferrer">
                      {file.UserFileName}
                    </a>
                  </div>
                )}

                {selectedInput === file?.ID ? (
                  <>
                    {isLoading ? (
                      <div className="icon-container">
                        <Spinner
                          size="sm"
                          variant="primary"
                          animation="border"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="icon-container"></div>
                        <div
                          className="icon-container"
                          onClick={() => updateFileName(file)}
                        >
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="icon-container" onClick={clearInput}>
                          <i className="fa fa-times"></i>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!hideEdit ? (
                      <>
                        <div
                          className="icon-container"
                          onClick={() => handleShowInput(file)}
                        >
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Edit</Tooltip>
                            }
                            delay={{ show: 250, hide: 400 }}
                          >
                            <i className="far fa-pencil-alt"></i>
                          </OverlayTrigger>
                        </div>
                        <div className="icon-container">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="button-tooltip">Share</Tooltip>
                            }
                            delay={{ show: 250, hide: 400 }}
                          >
                            <i className="fa fa-share-square"></i>
                          </OverlayTrigger>
                        </div>
                      </>
                    ) : null}
                    <div className="icon-container">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">Delete</Tooltip>}
                        delay={{ show: 250, hide: 400 }}
                      >
                        <i
                          onClick={() => handleDocumentDelete(file?.ID)}
                          className="far fa-trash-alt"
                        ></i>
                      </OverlayTrigger>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      )}
      {progress && progress.loading ? (
        <div className="progress">
          <div
            className="progress-bar progress-bar-info progress-bar-striped"
            role="progressbar"
            aria-valuenow={progress.progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: progress.progress + "%" }}
          >
            {progress.progress}%
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FileUpload;
