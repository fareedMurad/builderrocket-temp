import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import {
  addSubdivision,
  getSubdivisions,
} from "../../actions/subdivisionActions";
import {
  createProject,
  deleteProject,
  getProjectByProjectID,
  saveProject,
  setSelectedProject,
  setSelectedProjectTab,
  uploadProjectThumbnail,
  deleteProjectImage,
} from "../../actions/projectActions";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { withSwal } from "react-sweetalert2";
import toast from "react-hot-toast";
import Toaster from "react-hot-toast";

import "./ProjectInformation.scss";

// components
import FileUpload from "../FileUpload";
import CustomerModal from "../CustomerModal";
import MarketingBlock from "../MarketingBlock";
import ClearChangesModal from "../ClearChangesModal";
import { useHistory } from "react-router-dom";
import { ProjectStatus } from "../../utils/contants";
import {
  handleAddBuilderSubdivsionToProject,
  getBuilderSubdivisions,
  createBuilderSubdivsion,
} from "../../actions/builderSubdivisionActions";
import InputField from "../ProjectInput/TextInput";
import FieldLoader from "../ProjectFieldLoader";

const ProjectInformation = withSwal((props) => {
  const { swal } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const project = useSelector((state) => state.project.project);
  const originalProject = useSelector((state) => state.project.originalProject);
  const subdivisions = useSelector(
    (state) => state.subdivision.subdivisions
  )?.filter((s) => s.SubdivisionName != null);

  const [showModal, setShowModal] = useState(false);
  const [showSubdivisionModal, setShowSubdivisionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [projectInformation, setProjectInformation] = useState(project);
  const [projectImage, setProjectImage] = useState(null);
  const [newSubdivisionName, setNewSubdivisionName] = useState("");
  const [createProjectLoader, setCreateProjectLoader] = useState(false);
  const [fieldsLoader, setFieldsLoader] = useState({});

  // Ref to access changes on unmount
  const valueRef = useRef();
  useEffect(() => {
    dispatch(getBuilderSubdivisions());
  }, [dispatch]);

  useEffect(() => {
    setProjectInformation(project);
  }, []);

  function handleUpdateStatus(statusId) {
    if (statusId === -1) {
      handleDelete();
    } else {
      setProjectInformation({
        ...projectInformation,
        StatusID: parseInt(statusId),
      });
    }
  }

  function handleDelete() {
    swal
      .fire({
        title: "Confirm Delete",
        text: "Deleting project will also delete all its files,documents & any related info, do you want to continue?",
        icon: "warning",
        confirmButtonText: "Yes",
        showCancelButton: true,
      })
      .then((result) => handleConfirmDelete(result));
  }

  function handleConfirmDelete(result) {
    if (result.isConfirmed) {
      if (projectInformation?.StatusID === -1) {
        dispatch(deleteProject(project.ID)).then((result) => {
          if (result.success) {
            toast.success("Project deleted successfully");
            setTimeout(function () {
              history.push("/");
            }, 3000);
          } else {
            toast.error(result.message);
          }
        });
        return;
      }
    } else {
      setProjectInformation({
        ...projectInformation,
        StatusID: projectInformation?.StatusID,
      });
    }
  }

  const onFileChange = (type_id, event) => {
    let file = event.target?.files?.[0];

    progress[type_id] = { progress: 0, loading: false };
    setProgress({ ...progress });
    setProjectInformation({ ...projectInformation, ThumbnailName: file?.name });
    setProjectImage(file);

    if (!project?.ID) return;

    setIsLoading(true);

    const formData = new FormData();

    formData.append("File", event.target?.files?.[0]);

    // Save new thumbnail - update component state with updated data
    dispatch(
      uploadProjectThumbnail(project?.ID, formData, (event) => {
        progress[type_id] = {
          progress: Math.round((100 * event.loaded) / event.total),
          loading: true,
        };
        setProgress({ ...progress });
      })
    )
      .then(async (updatedProject) => {
        progress[type_id] = { progress: 0, loading: false };
        setProgress({ ...progress });
        await dispatch(getProjectByProjectID(project.ID));

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Something went wrong uploading thumbnail try again");
      });
  };

  const clearChanges = () => {
    // Reset component state with redux project state
    setProjectInformation({ ...project });

    setShowModal(false);
  };

  const handleShowCustomerModal = (bool) => {
    setShowCustomerModal(bool);
  };

  const saveChanges = async (goToNext = true, field) => {
    if (projectInformation?.StatusID === -1) {
      return;
    }
    if (!projectInformation.ProjectName) return;

    setIsLoading(true);

    setFieldsLoader({
      ...fieldsLoader,
      [field]: {
        loading: true,
      },
    });

    const payload = {
      ...projectInformation,
      Customers: projectInformation.Customers.filter((c) =>
        c.FirstName || c.LastName || c.Phone || c.Email ? true : false
      ).map((c, i) => {
        if (project?.Customers?.[0] && i == 0) {
          return { ...project?.Customers?.[0], ...c };
        } else if (project?.Customers?.[1] && i == 1) {
          return { ...project?.Customers?.[1], ...c };
        } else {
          return c;
        }
      }),
    };

    if (project?.ID) {
      // Save Project then navigate to documents tab
      await dispatch(saveProject(payload))
        .then(() => {
          setIsLoading(false);
          setFieldsLoader({
            [field]: {
              loading: false,
            },
          });
          if (goToNext) dispatch(setSelectedProjectTab("documents"));
        })
        .catch(() => {
          setFieldsLoader({
            ...fieldsLoader,
            [field]: {
              loading: false,
            },
          });
          setIsLoading(false);
          alert("Something went wrong saving project try again");
        });
    } else {
      delete payload.ThumbnailName;
      delete payload.ThumbnailURL;
      const newProject = {
        ...payload,
        DateCreated: new Date(),
        UserID: user.UserID,
        StatusID: payload?.StatusID || 1,
      };

      setCreateProjectLoader(true);

      dispatch(createProject(newProject))
        .then((res) => {
          setIsLoading(false);
          if (res?.ID) {
            uploadProjectImage(res?.ID);
          }

          setCreateProjectLoader(false);

          if (goToNext) dispatch(setSelectedProjectTab("documents"));
          else dispatch(setSelectedProjectTab("projectInformation"));
        })
        .catch(() => {
          setIsLoading(false);
          alert("Something went wrong creating project try again");
        });
    }
  };

  const uploadProjectImage = (projectId) => {
    if (!projectImage) return;
    const formData = new FormData();

    formData.append("File", projectImage);

    // Save new thumbnail - update component state with updated data
    dispatch(uploadProjectThumbnail(projectId, formData))
      .then(async (updatedProject) => {
        await dispatch(getProjectByProjectID(projectId));

        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        alert("Something went wrong uploading thumbnail try again");
      });
  };

  useEffect(() => {
    // reference latest changes
    valueRef.current = projectInformation;
  }, [projectInformation]);

  // useEffect(() => {
  //   return () => {
  //     // save any changes when navigating away
  //     dispatch(saveProject(valueRef.current));
  //   };
  // }, [dispatch]);

  useEffect(() => {
    if (
      project?.ID &&
      originalProject?.CloseDate !== projectInformation?.CloseDate
    )
      saveChanges(false, "ClosingDate");
  }, [projectInformation?.CloseDate]);

  useEffect(() => {
    if (
      project?.ID &&
      originalProject?.Subdivision !== projectInformation?.Subdivision
    )
      saveChanges(false, "Subdivision");
  }, [projectInformation?.Subdivision]);

  useEffect(() => {
    if (
      project?.ID &&
      originalProject?.StatusID !== projectInformation?.StatusID
    )
      saveChanges(false, "ProjectStatus");
  }, [projectInformation?.StatusID]);

  // const customerFullName = () => {
  //   let customerName = "";

  //   if (
  //     projectInformation?.Customers?.[0]?.FirstName &&
  //     !projectInformation?.Customers?.[0]?.LastName
  //   ) {
  //     customerName = projectInformation?.Customers?.[0]?.FirstName;
  //   }

  //   if (
  //     projectInformation?.Customers?.[0]?.FirstName &&
  //     projectInformation?.Customers?.[0]?.LastName
  //   ) {
  //     customerName =
  //       projectInformation?.Customers?.[0]?.FirstName +
  //       " " +
  //       projectInformation?.Customers?.[0]?.LastName;
  //   }

  //   return customerName;
  // };

  const cancelModal = () => {
    setShowSubdivisionModal(false);
  };

  const saveAsNewSubdivision = () => {
    if (!newSubdivisionName) return;

    setIsLoading(true);

    dispatch(createBuilderSubdivsion(newSubdivisionName))
      .then((subdivisions) => {
        setIsLoading(false);
        dispatch(getBuilderSubdivisions());
        setProjectInformation({
          ...projectInformation,
          Subdivision: subdivisions.find(
            (d) => d.SubdivisionName === newSubdivisionName
          )?.ID,
        });
        cancelModal();
      })
      .catch(() => {
        setIsLoading(false);
        alert("Something went wrong creating a subdivision try again");
      });
  };

  const handleChangeSubdivision = (ID) => {
    setProjectInformation({
      ...projectInformation,
      Subdivision: ID,
    });
  };

  const saveNewSubdivisionModal = () => {
    return (
      <Modal
        size="md"
        centered
        show={showSubdivisionModal}
        className="new-subdivision-modal"
        onHide={() => setShowSubdivisionModal(false)}
      >
        <Modal.Body className="modal-container">
          <div className="page-title">Add Subdivision</div>
          <Form>
            <Form.Label className="input-label">Subdivision Name</Form.Label>
            <Form.Control
              className="input-gray"
              value={newSubdivisionName}
              onChange={(e) => setNewSubdivisionName(e.target.value)}
            />
          </Form>
          <div className="d-flex justify-content-center mt-3">
            {isLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <>
                <Button variant="link" className="cancel" onClick={cancelModal}>
                  Cancel
                </Button>
                <Button
                  className="primary-gray-btn next-btn ml-3"
                  onClick={saveAsNewSubdivision}
                >
                  Save
                </Button>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    );
  };
  if (!projectInformation) {
    return <Spinner animation="border" variant="primary" />;
  }

  const handleProjectImageDelete = () => {
    setIsLoading(true);
    dispatch(deleteProjectImage(project.ID))
      .then((response) => {
        if (response) {
          dispatch(
            setSelectedProject({
              ...project,
              ThumbnailName: null,
              ThumbnailURL: null,
            })
          );
          setProjectInformation({
            ...projectInformation,
            ThumbnailName: null,
            ThumbnailURL: null,
          });
          setSelectedInput();
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const [selectedInput, setSelectedInput] = useState();
  const [progress, setProgress] = useState({});

  let fileProgress = (id) => {
    if (!progress) return {};
    return { ...progress[id] };
  };

  console.log(fieldsLoader, "fieldsLoader");

  return (
    <div className="d-flex project-information">
      <div className="information-form-container  position-relative">
        <div className="page-title">Project Information</div>

        <Form>
          <div className="d-flex flex-wrap information-form">
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="Project Name"
                loading={fieldsLoader?.["ProjectName"]?.loading}
                value={projectInformation?.ProjectName}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    ProjectName: event.target.value,
                  })
                }
                onBlur={() => saveChanges(false, "ProjectName")}
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <FileUpload
                short
                label="Project Image"
                buttonText="Upload Image"
                progress={fileProgress("Project_Image")}
                files={
                  project.ThumbnailURL
                    ? [
                        {
                          UserFileName: projectInformation?.ThumbnailName,
                          URL: projectInformation.ThumbnailURL,
                          ID: "Project_Image",
                        },
                      ]
                    : []
                }
                selectedInput={selectedInput}
                setSelectedInput={setSelectedInput}
                handleDocumentDelete={handleProjectImageDelete}
                onFileChange={(event) => onFileChange("Project_Image", event)}
                hideEdit
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="Lot #"
                loading={fieldsLoader?.["LotNumber"]?.loading}
                value={projectInformation?.LotNumber}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    LotNumber: event.target.value,
                  })
                }
                onBlur={() =>
                  project?.ID ? saveChanges(false, "LotNumber") : {}
                }
              />
            </div>
            <div className="col-12 col-md-6 select pb-4">
              <Form.Label className="input-label">
                Project Status{" "}
                <FieldLoader
                  loading={fieldsLoader?.["ProjectStatus"]?.loading}
                />
              </Form.Label>
              <Form.Control
                as="select"
                value={projectInformation?.StatusID}
                onChange={(event) =>
                  handleUpdateStatus(parseInt(event.target.value))
                }
              >
                {ProjectStatus.filter((item) =>
                  project?.ID ? true : item.id !== -1
                ).map((status, index) => (
                  <option key={index} value={status.id}>
                    {status.text}
                  </option>
                ))}
              </Form.Control>
            </div>
            {/* <div className="col-12 col-md-6 pb-4"></div> */}
            <div className="col-12 pb-4">
              <Form.Label className="input-label">Customer's Info</Form.Label>
              <div>
                <Form.Label className="input-label">Customer 1</Form.Label>
              </div>
              <div className="row">
                <div className="col-12 col-md-2">
                  <InputField
                    label="First Name"
                    loading={fieldsLoader?.["C1FirstName"]?.loading}
                    value={projectInformation?.Customers?.[0]?.FirstName ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[0]) {
                          NewState.Customers[0].FirstName = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[0] = {
                              FirstName: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C1FirstName") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-2">
                  <InputField
                    label="Last Name"
                    loading={fieldsLoader?.["C1LastName"]?.loading}
                    value={projectInformation?.Customers?.[0]?.LastName ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[0]) {
                          NewState.Customers[0].LastName = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[0] = {
                              ...NewState.Customers[0],
                              LastName: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C1LastName") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-2">
                  <InputField
                    label="Mobile"
                    loading={fieldsLoader?.["C1Mobile"]?.loading}
                    value={projectInformation?.Customers?.[0]?.Phone ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[0]) {
                          NewState.Customers[0].Phone = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[0] = {
                              ...NewState.Customers[0],
                              Phone: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C1Mobile") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-6">
                  {/* <Form.Label className="input-label"></Form.Label> */}
                  <InputField
                    label="Email"
                    type="email"
                    loading={fieldsLoader?.["C1Email"]?.loading}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[0]) {
                          NewState.Customers[0].Email = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[0] = {
                              ...NewState.Customers[0],
                              Email: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    value={projectInformation?.Customers?.[0]?.Email ?? ""}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C1Email") : {}
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12 pb-4">
              <Form.Label className="input-label">Customer 2</Form.Label>
              <div className="row">
                <div className="col-12 col-md-2">
                  <InputField
                    label="First Name"
                    loading={fieldsLoader?.["C2FirstName"]?.loading}
                    value={projectInformation?.Customers?.[1]?.FirstName ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[1]) {
                          NewState.Customers[1].FirstName = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[1] = {
                              FirstName: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C2FirstName") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-2">
                  <InputField
                    label="Last Name"
                    loading={fieldsLoader?.["C2LastName"]?.loading}
                    value={projectInformation?.Customers?.[1]?.LastName ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[1]) {
                          NewState.Customers[1].LastName = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[1] = {
                              ...NewState.Customers[1],
                              LastName: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C2LastName") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-2">
                  <InputField
                    label="Mobile"
                    loading={fieldsLoader?.["C2Mobile"]?.loading}
                    value={projectInformation?.Customers?.[1]?.Phone ?? ""}
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[1]) {
                          NewState.Customers[1].Phone = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[1] = {
                              ...NewState.Customers[1],
                              Phone: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C2Mobile") : {}
                    }
                  />
                </div>
                <div className="col-12 col-md-6">
                  <InputField
                    label="Email"
                    loading={fieldsLoader?.["C2Email"]?.loading}
                    type="email"
                    onChange={(e) => {
                      setProjectInformation((prev) => {
                        const NewState = { ...prev };
                        if (NewState.Customers?.[1]) {
                          NewState.Customers[1].Email = e.target.value;
                          return NewState;
                        } else {
                          const newRowData = [
                            ...NewState.Customers,
                            (NewState.Customers[1] = {
                              ...NewState.Customers[1],
                              Email: e.target.value,
                            }),
                          ];
                          NewState.Customers = newRowData;
                          return NewState;
                        }
                      });
                    }}
                    value={projectInformation?.Customers?.[1]?.Email ?? ""}
                    onBlur={() =>
                      project?.ID ? saveChanges(false, "C2Email") : {}
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="Plan Name"
                loading={fieldsLoader?.["PlanName"]?.loading}
                value={projectInformation?.PlanName}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    PlanName: event.target.value,
                  })
                }
                onBlur={() =>
                  project?.ID ? saveChanges(false, "PlanName") : {}
                }
              />
            </div>

            {saveNewSubdivisionModal()}
            <div className="col-12 col-md-6 pb-3 select">
              <Form.Label className="input-label">
                Subdivision{" "}
                <FieldLoader loading={fieldsLoader?.["Subdivision"]?.loading} />
              </Form.Label>
              <Form.Control
                as="select"
                value={projectInformation?.Subdivision}
                onChange={(event) => {
                  event.target.value === "Add New Subdivision"
                    ? setShowSubdivisionModal(true)
                    : handleChangeSubdivision(event.target.value);
                }}
              >
                <option
                  className="link-btn"
                  value="Add New Subdivision"
                  selected={false}
                >
                  + Add New Subdivision
                </option>
                <option hidden selected={!newSubdivisionName}></option>

                {subdivisions?.map((subdivision, index) => (
                  <option
                    selected={
                      projectInformation?.Subdivision === subdivision?.ID
                    }
                    key={index}
                    value={subdivision.ID}
                  >
                    {subdivision.SubdivisionName}
                  </option>
                ))}
              </Form.Control>
            </div>

            {/* <div className="col-12 col-md-6 pb-5"></div> */}

            <div className="col-12 col-md-6 pb-2">
              <InputField
                label="Street Address 1"
                loading={fieldsLoader?.["StreetAddress1"]?.loading}
                value={projectInformation?.StreetAddress1}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    StreetAddress1: event.target.value,
                  })
                }
                onBlur={() =>
                  project?.ID ? saveChanges(false, "StreetAddress1") : {}
                }
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="Street Address2"
                loading={fieldsLoader?.["StreetAddress2"]?.loading}
                value={projectInformation?.StreetAddress2}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    StreetAddress2: event.target.value,
                  })
                }
                onBlur={() =>
                  project?.ID ? saveChanges(false, "StreetAddress2") : {}
                }
              />
            </div>
            <div className="col-12 col-md-6 pb-2">
              <InputField
                label="City"
                loading={fieldsLoader?.["City"]?.loading}
                value={projectInformation?.City}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    City: event.target.value,
                  })
                }
                onBlur={() => (project?.ID ? saveChanges(false, "City") : {})}
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="State"
                loading={fieldsLoader?.["State"]?.loading}
                value={projectInformation?.State}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    State: event.target.value,
                  })
                }
                onBlur={() => (project?.ID ? saveChanges(false, "State") : {})}
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                label="Zip Code"
                loading={fieldsLoader?.["Zip"]?.loading}
                value={projectInformation?.Zip}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    Zip: event.target.value,
                  })
                }
                onBlur={() => (project?.ID ? saveChanges(false, "Zip") : {})}
              />
            </div>

            <div className="col-12 col-md-6">
              <Form.Label className="input-label">
                Closing Date{" "}
                <FieldLoader loading={fieldsLoader?.["ClosingDate"]?.loading} />
              </Form.Label>
              <DatePicker
                className="input-gray date-picker"
                onChange={(date) =>
                  setProjectInformation({
                    ...projectInformation,
                    CloseDate: date,
                  })
                }
                selected={
                  projectInformation?.CloseDate
                    ? new Date(projectInformation?.CloseDate)
                    : ""
                }
              />
            </div>
            <div className="col-12 col-md-6 pb-4">
              <InputField
                as={"textarea"}
                loading={fieldsLoader?.["Notes"]?.loading}
                label="Notes"
                value={projectInformation?.Notes}
                onChange={(event) =>
                  setProjectInformation({
                    ...projectInformation,
                    Notes: event.target.value,
                  })
                }
                onBlur={() => (project?.ID ? saveChanges(false, "Notes") : {})}
              />
            </div>
            <div className="col-12 col-md-6" />
          </div>
        </Form>

        {/* <ClearChangesModal
          show={showModal}
          setShow={setShowModal}
          clearChanges={clearChanges}
        /> */}

        <CustomerModal
          show={showCustomerModal}
          setShow={handleShowCustomerModal}
          setCustomer={setProjectInformation}
          project={projectInformation}
        />

        <div className="d-flex justify-content-center pt-5">
          {project?.ID ? (
            <>
              {/* <Button
                variant="link"
                className="cancel"
                onClick={() => setShowModal(true)}
              >
                Cancel
              </Button> */}
              <Button
                onClick={() => dispatch(setSelectedProjectTab("documents"))}
                className="primary-gray-btn next-btn ml-3"
              >
                Next
              </Button>
            </>
          ) : (
            <Button
              onClick={saveChanges}
              className="primary-gray-btn next-btn ml-3"
            >
              Save
            </Button>
          )}
        </div>
        {createProjectLoader && (
          <div
            style={{
              zIndex: 9999999,
              position: "fixed",
              background: "rgba(0,0,0,0.3)",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          >
            <div
              className="h-100 w-100 spinner d-flex flex-column align-items-center text-primary justify-content-center "
              style={{
                zIndex: 9999999,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Spinner animation="border" variant="primary" className="mb-3" />
              Creating your project...
            </div>
          </div>
        )}
      </div>

      <MarketingBlock />
    </div>
  );
});

export default withSwal(ProjectInformation);
