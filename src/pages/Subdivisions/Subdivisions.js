import React, { useEffect, useState } from "react";
import "./Subdivisions.scss";
import "react-bootstrap-accordion/dist/index.css";
import { Accordion } from "react-bootstrap-accordion";
import { Table, Modal, Button, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  createBuilderSubdivsion,
  deleteBuilderSubdivsion,
  editBuilderSubdivsion,
  getBuilderSubdivisions,
  addBuilderSubdivsionDocument,
} from "../../actions/builderSubdivisionActions";
import FileUpload from "../../components/FileUpload";
import { deleteDocument } from "../../actions/documentActions";

const Subdivisions = () => {
  const [modalVisible, setModalVisible] = useState("");
  const [subdivisionName, setSubdivisionName] = useState("");
  const [subdivisions, setSubdivisions] = useState([]);
  const [selectedSubdivision, setSelectedSubdivision] = useState({});
  const [newSubdivision, setNewSubdivision] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [newDocument, setNewDocument] = useState();

  const dispatch = useDispatch();
  useEffect(() => {
    handleFetchSubdivisions();
  }, []);

  const handleFetchSubdivisions = () => {
    dispatch(getBuilderSubdivisions()).then((data) => {
      setSubdivisions(data);
      setIsLoading(false);
    });
  };

  const handleInputChange = (event) => {
    setSubdivisionName(event.target.value);
  };

  const handleAdd = () => {
    if (subdivisionName) {
      dispatch(createBuilderSubdivsion(subdivisionName))
        .then((res) => {
          console.log(res, "res");
          handleFetchSubdivisions();
          setModalVisible("");
        })
        .catch(() => {
          alert("Something went wrong, please try again!");
        });
      setSubdivisionName("");
    }
  };

  const handleAddNewDocumentSubdivision = () => {
    if (newDocument) {
      // Save new file / document
      const formData = new FormData();

      formData.append("DocumentTypeID", 1);
      formData.append("File", newDocument);

      dispatch(
        addBuilderSubdivsionDocument(
          selectedSubdivision.ID,
          formData,
          (event) => {
            progress[1] = {
              progress: Math.round((100 * event.loaded) / event.total),
              loading: true,
            };
            setProgress({ ...progress });
          } 
        )
      )
        .then((response) => {
          progress[1] = { progress: 0, loading: false };
          setProgress({ ...progress });
          handleFetchSubdivisions();
          setNewDocument({});
          setModalVisible("")
        })
        .catch(() => {
          progress[1] = { progress: 0, loading: false };
          setProgress({ ...progress });
          alert("Something is wrong, please try!");
        });
    }
  };

  const handleEditSubdivision = () => {
    const params = {
      ID: selectedSubdivision?.ID,
      SubdivisionName: subdivisionName,
    };

    dispatch(editBuilderSubdivsion(params))
      .then((res) => {
        setModalVisible("");
        handleFetchSubdivisions();
        setSubdivisionName("");
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleDeleteSubdivision = () => {
    dispatch(deleteBuilderSubdivsion(selectedSubdivision.ID))
      .then((res) => {
        setModalVisible("");
        handleFetchSubdivisions();
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const handleDeleteSubdivisionDocument = () => {
    dispatch(deleteDocument(selectedSubdivision.ID))
      .then((res) => {
        setModalVisible("");
        handleFetchSubdivisions();
      })
      .catch(() => {
        alert("Something went wrong, please try again!");
      });
  };

  const deleteSubdivisionModal = () => {
    const isSubdivision = modalVisible === "DELETE_SUBDIVISION";
    return (
      <Modal
        show={isSubdivision || modalVisible === "DELETE_SUBDIVISION_DOCUMENT"}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            Delete Subdivision {isSubdivision ? "" : "Document"}
          </div>
          <div className="d-flex">
            Are you sure you want to delete this Subdivision{" "}
            {isSubdivision ? "" : "Document"}?
          </div>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={
                isSubdivision
                  ? handleDeleteSubdivision
                  : handleDeleteSubdivisionDocument
              }
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const editAddSubdivisionModal = () => {
    const isAdd = modalVisible === "ADD_SUBDIVISION";
    return (
      <Modal
        show={modalVisible === "EDIT_SUBDIVISION" || isAdd}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">
            {isAdd ? "Add New" : "Edit"} Subdivision
          </div>
          <Form.Group>
            <Form.Label className="input-label">Subdivision Name*</Form.Label>
            <Form.Control
              type="text"
              className="input-gray"
              value={subdivisionName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={isAdd ? handleAdd : handleEditSubdivision}
            >
              {isAdd ? "Add" : "Edit"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  let fileProgress = (id) => {
    if (!progress) return {};
    return { ...progress[id] };
  };

  const onFileChange = (documentTypeID, event) => {
    progress[documentTypeID] = { progress: 0, loading: true };
    setProgress({ ...progress });
    setNewDocument(event.target?.files?.[0]);
  };


  const addDocumentModal = () => {
    return (
      <Modal
        show={modalVisible === "ADD_SUBDIVISION_DOCUMENT"}
        onHide={() => setModalVisible("")}
        centered
        size="md"
      >
        <Modal.Body>
          <div className="page-title pl-0">Add New Document</div>
          <FileUpload
            short
            placeholder={newDocument?.name}
            buttonText={"Upload Document"}
            progress={fileProgress(1)}
            // label={findDocumentType(1)?.Name}
            handleDocumentDelete={handleDeleteSubdivisionDocument}
            onFileChange={(event) => onFileChange(1, event)}
          />
          <div className="d-flex justify-content-center pt-5">
            <Button
              onClick={() => setModalVisible("")}
              variant="link"
              className="cancel"
            >
              Cancel
            </Button>
            <button
              className="primary-gray-btn next-btn ml-3"
              onClick={handleAddNewDocumentSubdivision}
            >
              Add
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const handleEditSubdivisionModal = (e, item) => {
    e.stopPropagation();
    setSubdivisionName(item.SubdivisionName);
    setSelectedSubdivision(item);
    setModalVisible("EDIT_SUBDIVISION");
  };

  //   const handleEditSubdivisionModal = (e, room) => {
  //     e.stopPropagation();
  //     setSelectedSubdivision(room);
  //     setNewSubdivision({
  //       name: room?.Name,
  //       group: room?.DefaultRoomGroup
  //         ? {
  //             ...room?.DefaultRoomGroup,
  //             value: room?.DefaultRoomGroup?.ID,
  //             label: room?.DefaultRoomGroup?.Name,
  //           }
  //         : {},
  //     });
  //     setModalVisible("EDIT_SUBDIVISION");
  //   };

  const handleAddSubdivisionDocument = (e, item) => {
    e.stopPropagation();
    setSelectedSubdivision(item);
    setModalVisible("ADD_SUBDIVISION_DOCUMENT");
  };

  const handleAddsubdivision = (e) => {
    e.stopPropagation();
    setModalVisible("ADD_SUBDIVISION");
  };

  const handleDeleteSubdivisionModal = (e, item) => {
    e.stopPropagation();
    setSelectedSubdivision(item);
    setModalVisible("DELETE_SUBDIVISION");
  };

  const handleDeleteSubdivisionDocumentModal = (e, room) => {
    e.stopPropagation();
    setSelectedSubdivision(room);
    setModalVisible("DELETE_SUBDIVISION_DOCUMENT");
  };

  return (
    <div className="subdivisions">
      <div className="page-title pl-0">Subdivisions</div>
      <div className="room-management-container">
        <Button
          variant="link"
          className="link-btn"
          onClick={(e) => handleAddsubdivision(e)}
        >
          + Add Subdivision
        </Button>

        {isLoading ? (
          <div className="pt-5 pb-5 w-full h-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          subdivisions?.map((item, index) => (
            <Accordion
              title={
                <div className="d-flex justify-content-between w-100 pr-5">
                  <div className="d-flex align-selecItem-center">
                    <div className="font-weight-bold mr-5">
                      {item.SubdivisionName}
                    </div>
                    <i
                      className="far fa-pen fa-sm tab-icon p-2"
                      onClick={(e) => handleEditSubdivisionModal(e, item)}
                    ></i>
                    <i
                      className="far fa-plus fa-sm tab-icon p-2"
                      onClick={(e) => handleAddSubdivisionDocument(e, item)}
                    ></i>
                    <i
                      className="far fa-trash fa-sm tab-icon p-2"
                      onClick={(e) => handleDeleteSubdivisionModal(e, item)}
                    ></i>
                  </div>
                  <span className="px-2">
                    {item.Documents?.length} documents
                  </span>{" "}
                </div>
              }
              children={
                <div>
                  {" "}
                  <Table>
                    <tbody>
                      {item.Documents?.length ? (
                        item.Documents?.map((room, index) => {
                          return (
                            <tr key={index}>
                              <td>
                              <a 
                               href={room?.URL} 
                               target='_blank'
                               rel='noreferrer'
                            >
                                {room.FileName}
                           </a>
                               </td>
                              <td>
                                <div className="d-flex">
                                  {/* <i
                                    className="far fa-pen fa-sm tab-icon px-2"
                                    onClick={(e) =>
                                      handleEditSubdivisionModal(e, room)
                                    }
                                  ></i> */}
                                  <i
                                    className="far fa-trash fa-sm tab-icon px-2 pointer"
                                    onClick={(e) =>
                                      handleDeleteSubdivisionDocumentModal(
                                        e,
                                        room
                                      )
                                    }
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <td>No documents added</td>
                      )}
                    </tbody>
                  </Table>
                </div>
              }
            />
          ))
        )}
        {deleteSubdivisionModal()}
        {editAddSubdivisionModal()}
        {addDocumentModal()}
      </div>
    </div>
  );
};

export default Subdivisions;
