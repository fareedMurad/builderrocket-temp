import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner, Form } from "react-bootstrap";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../actions/documentActions";
import {
  getProjectByProjectID,
  setSelectedProject,
} from "../../actions/projectActions";
import "./Drawings.scss";
import CustomLightbox from "../Lightbox";

// components
import MarketingBlock from "../MarketingBlock";

const Drawings = () => {
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.project);

  const [isLoading, setIsLoading] = useState(false);
  const [newDrawingName, setNewDrawingName] = useState("");
  const [selectedDrawing, setSelectedDrawing] = useState();
  const [isLoadingDrawing, setIsLoadingDrawing] = useState(false);

  const inputFile = useRef();

  useEffect(() => {
    if (selectedDrawing)
      setNewDrawingName(
        returnDrawings()?.find((d) => d.ID === selectedDrawing)?.UserFileName,
      );
  }, [selectedDrawing]);

  const browse = () => {
    // clicks file upload input through button
    inputFile.current.click();
  };

  const returnDrawings = () => {
    const drawings = project?.Documents?.filter((document) => {
      return document.DocumentTypeID === 11;
    });

    if (drawings?.length > 0) return drawings;

    return [];
  };

  const onFileChange = (event) => {
    if (!project?.ID) return alert("Select project and try again");

    const files = [...event.target.files];

    if (files.length === 0) return alert("No drawings were selected");

    setIsLoading(true);

    // Drawings Document TypeID
    const documentTypeID = 11;

    files.forEach(async (file, index) => {
      // Save new file / document
      const formData = new FormData();

      formData.append("DocumentTypeID", documentTypeID);
      formData.append("File", file);

      await dispatch(addDocument(project.ID, formData))
        .then((response) => {
          if (response) {
            let documents = project?.Documents?.filter(
              (d) => d?.DocumentTypeID !== documentTypeID,
            );
            documents = documents.concat(
              response.Documents?.filter(
                (d) => d?.DocumentTypeID === documentTypeID,
              ),
            );
            project.Documents = documents;
            dispatch(setSelectedProject({ ...project }));
          }
          if (files.length === index + 1) {
            setIsLoading(false);
          }

          return;
        })
        .catch(() => {
          alert("Something went wrong uploading drawing, please try again");
          setIsLoading(false);
        });
    });
  };

  const updateFileName = (drawing) => {
    if (!drawing?.ID) return;

    setIsLoadingDrawing(true);

    const drawingNameObj = {
      ID: drawing.ID,
      DocumentTypeID: drawing.DocumentTypeID,
      FileName: drawing.FileName,
      UserFileName: newDrawingName,
    };

    dispatch(updateDocument(drawingNameObj))
      .then(() => clearInput())
      .then(async () => {
        project.Documents = project?.Documents?.map((d) => {
          if (d?.ID === drawing.ID) {
            return { ...d, UserFileName: newDrawingName };
          } else return d;
        });
        dispatch(setSelectedProject({ ...project }));
      })
      .then(() => setIsLoadingDrawing(false))
      .catch(() => {
        alert("Something went wrong updating document name");
        setIsLoadingDrawing(false);
      });
  };

  const clearInput = () => {
    setNewDrawingName("");
    setSelectedDrawing();
  };

  const handleDrawingDelete = async (drawingID) => {
    if (!project?.ID) return;

    setIsLoading(true);
    // delete document by document ID then refresh project
    await dispatch(deleteDocument(drawingID))
      .then(async () => {
        project.Documents = project?.Documents?.filter(
          (d) => d?.ID !== drawingID,
        );
        dispatch(setSelectedProject({ ...project }));
        setIsLoading(false);
        return;
      })
      .catch(() => {
        alert("Something went wrong deleting drawing try again");
        setIsLoading(false);
      });
  };

  return (
    <div className="d-flex drawings">
      <div className="drawings-container">
        <div className="d-flex">
          <div className="page-title">Drawings</div>

          <div className="ml-1">
            <Button variant="link" className="link-btn" onClick={browse}>
              + Add Drawings
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

        <div className="drawings-form">
          {isLoading ? (
            <div className="spinner d-flex justify-content-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {returnDrawings()?.map((drawing, index) => (
                <div key={index} className="d-flex drawing">
                  <div className="drawing-image">
                    {drawing?.IsImage ? (
                      <CustomLightbox images={[drawing?.URL]} />
                    ) : (
                      <div className="drawing-image-icon">
                        <i className={`far fa-${drawing?.Icon}`}></i>
                      </div>
                    )}
                  </div>

                  {selectedDrawing === drawing?.ID ? (
                    <div className="d-flex justify-content-between edit-drawings-container">
                      <div className="file-input">
                        <Form.Control
                          value={newDrawingName}
                          onChange={(event) =>
                            setNewDrawingName(event.target.value)
                          }
                        />
                      </div>
                      {isLoadingDrawing ? (
                        <div className="spinner-container">
                          <Spinner
                            size="sm"
                            variant="primary"
                            animation="border"
                          />
                        </div>
                      ) : (
                        <div
                          className="icon-container d-flex align-items-center"
                          style={{ gap: "20px" }}
                        >
                          <div className="icon-container"></div>
                          <div
                            className="icon-container"
                            onClick={() => updateFileName(drawing)}
                          >
                            <i className="fa fa-check text-success"></i>
                          </div>
                          <div className="icon-container" onClick={clearInput}>
                            <i className="fa fa-times"></i>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between name-icons">
                      <div className="drawing-name">
                        <a href={drawing?.URL} target="_blank" rel="noreferrer">
                          {drawing?.UserFileName}
                        </a>
                      </div>
                      <div className="d-flex icon-container">
                        <div
                          className="icon"
                          onClick={() => setSelectedDrawing(drawing?.ID)}
                        >
                          <i className="far fa-pencil-alt"></i>
                        </div>
                        <div className="icon">
                          <i className="fa fa-share-square"></i>
                        </div>
                        <div className="icon">
                          <i
                            onClick={() => handleDrawingDelete(drawing?.ID)}
                            className="far fa-trash-alt"
                          ></i>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <MarketingBlock />
    </div>
  );
};

export default Drawings;
