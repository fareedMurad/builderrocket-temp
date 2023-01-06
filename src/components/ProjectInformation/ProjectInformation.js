import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {addSubdivision, getSubdivisions} from "../../actions/subdivisionActions";
import {
    createProject,
    deleteProject,
    getProjectByProjectID,
    saveProject,
    setSelectedProjectTab,
    uploadProjectThumbnail,
} from "../../actions/projectActions";
import {useDispatch, useSelector} from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import {withSwal} from 'react-sweetalert2';
import toast from 'react-hot-toast';
import Toaster from 'react-hot-toast';

import "./ProjectInformation.scss";

// components
import FileUpload from "../FileUpload";
import CustomerModal from "../CustomerModal";
import MarketingBlock from "../MarketingBlock";
import ClearChangesModal from "../ClearChangesModal";
import {useHistory} from "react-router-dom";
import {ProjectStatus} from "../../utils/contants";



const ProjectInformation = withSwal((props) => {
    const {swal} = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const project = useSelector((state) => state.project.project);
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

    // Ref to access changes on unmount
    const valueRef = useRef();
    useEffect(() => {
        dispatch(getSubdivisions());
    }, [dispatch]);

    useEffect(() => {
        setProjectInformation(project);
    }, [project]);

    function handleUpdateStatus(statusId) {
        if (statusId === -1) {
          handleDelete();
        } else {
            setProjectInformation({
                ...projectInformation,
                StatusID: parseInt(statusId),
            })
        }
    }

    function handleDelete() {
        swal.fire({
            title: 'Confirm Delete',
            text: 'Deleting project will also delete all its files,documents & any related info, do you want to continue?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }).then((result) => handleConfirmDelete(result));
    }

    function handleConfirmDelete(result) {
        if (result.isConfirmed) {
            setProjectInformation({
                ...projectInformation,
                StatusID: -1,
            })
        }else{
            setProjectInformation({
                ...projectInformation,
                StatusID: projectInformation?.StatusID,
            })
        }
    }

    const onFileChange = (event) => {
        let file = event.target?.files?.[0];
        setProjectInformation({...projectInformation, ThumbnailName: file?.name});
        setProjectImage(file);
        if (!project?.ID) return;

        setIsLoading(true);

        const formData = new FormData();

        formData.append("File", event.target?.files?.[0]);

        // Save new thumbnail - update component state with updated data
        dispatch(uploadProjectThumbnail(project?.ID, formData))
            .then(async (updatedProject) => {
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
        setProjectInformation({...project});

        setShowModal(false);
    };

    const handleShowCustomerModal = (bool) => {
        setShowCustomerModal(bool);
    };

    const saveChanges = () => {
        if (projectInformation?.StatusID === -1) {
            dispatch(deleteProject(project.ID)).then(result => {
                if (result.success) {
                    toast.success('Project deleted successfully');
                    setTimeout(function () {
                        history.push('/');
                    }, 3000);
                } else {
                    toast.error(result.message);
                }
            });
            return;
        }
        if (!projectInformation.ProjectName) return;

        setIsLoading(true);

        if (project?.ID) {
            // Save Project then navigate to documents tab
            dispatch(saveProject(projectInformation))
                .then(() => {
                    setIsLoading(false);
                    dispatch(setSelectedProjectTab("documents"));
                })
                .catch(() => {
                    setIsLoading(false);
                    alert("Something went wrong saving project try again");
                });
        } else {
            const newProject = {
                ...projectInformation,
                DateCreated: new Date(),
                UserID: user.UserID,
                StatusID: projectInformation?.StatusID || 1,
            };

            dispatch(createProject(newProject))
                .then((res) => {
                    setIsLoading(false);
                    window.scrollTo(0, 0);
                    console.log(res, "response");
                    if (res?.ID) {
                        uploadProjectImage(res?.ID);
                    }
                })
                .catch(() => {
                    setIsLoading(false);
                    window.scrollTo(0, 0);
                    alert("Something went wrong creating project try again");
                });
            dispatch(setSelectedProjectTab("documents"));
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

    useEffect(() => {
        return () => {
            // save any changes when navigating away
            dispatch(saveProject(valueRef.current));
        };
    }, [dispatch]);

    const customerFullName = () => {
        let customerName = "";

        if (
            projectInformation?.Customers?.[0]?.FirstName &&
            !projectInformation?.Customers?.[0]?.LastName
        ) {
            customerName = projectInformation?.Customers?.[0]?.FirstName;
        }

        if (
            projectInformation?.Customers?.[0]?.FirstName &&
            projectInformation?.Customers?.[0]?.LastName
        ) {
            customerName =
                projectInformation?.Customers?.[0]?.FirstName +
                " " +
                projectInformation?.Customers?.[0]?.LastName;
        }

        return customerName;
    };

    const cancelModal = () => {
        setShowSubdivisionModal(false);
    };

    const saveAsNewSubdivision = () => {
        if (!newSubdivisionName) return;

        setIsLoading(true);

        dispatch(addSubdivision({subdivisionName: newSubdivisionName}))
            .then((subdivisions) => {
                setIsLoading(false);
                setNewSubdivisionName(newSubdivisionName);
                setProjectInformation({
                    ...projectInformation,
                    Subdivision: subdivisions.find(
                        (d) => d.SubdivisionName === newSubdivisionName
                    )?.SubdivisionName,
                });
                cancelModal();
            })
            .catch(() => {
                setIsLoading(false);
                alert("Something went wrong creating a subdivision try again");
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
                            <Spinner animation="border" variant="primary"/>
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

    return (
        <div className="d-flex project-information">
            <div className="information-form-container">
                <div className="page-title">Project Information</div>

                <Form>
                    <div className="d-flex flex-wrap information-form">
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Project Name</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.ProjectName}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        ProjectName: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col pb-4">
                            <FileUpload
                                short
                                label="Project Image"
                                buttonText="Upload Image"
                                fileURL={projectInformation?.ThumbnailURL}
                                onFileChange={(event) => onFileChange(event)}
                                placeholder={projectInformation?.ThumbnailName}
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Customer Name</Form.Label>
                            <Form.Control
                                readOnly
                                className="input-gray"
                                value={customerFullName()}
                                onClick={() => setShowCustomerModal(true)}
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Customer Email</Form.Label>
                            <Form.Control
                                readOnly
                                type="email"
                                className="input-gray"
                                onClick={() => setShowCustomerModal(true)}
                                value={projectInformation?.Customers?.[0]?.Email}
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Plan Name</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.PlanName}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        PlanName: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col select pb-4">
                            <Form.Label className="input-label">Project Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={projectInformation?.StatusID}
                                onChange={(event) =>
                                    handleUpdateStatus(parseInt(event.target.value))
                                }
                            >
                                {ProjectStatus.filter((item) => project?.ID ? true : item.id !== -1).map((status, index) => (
                                    <option key={index} value={status.id}>
                                        {status.text}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>
                        {saveNewSubdivisionModal()}
                        <div className="form-col pb-3 select">
                            <Form.Label className="input-label">Subdivision</Form.Label>
                            <Form.Control
                                as="select"
                                value={projectInformation?.Subdivision}
                                onChange={(event) => {
                                    event.target.value === "Add New Subdivision"
                                        ? setShowSubdivisionModal(true)
                                        : setProjectInformation({
                                            ...projectInformation,
                                            Subdivision: event.target.value,
                                        });
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
                                            projectInformation?.Subdivision?.SubdivisionName ===
                                            subdivision?.SubdivisionName
                                        }
                                        key={index}
                                        value={subdivision.SubdivisionName}
                                    >
                                        {subdivision.SubdivisionName}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>

                        <div className="form-col pb-5"></div>

                        <div className="form-col pb-2">
                            <Form.Label className="input-label">Street Address 1</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.StreetAddress1}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        StreetAddress1: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Street Address2</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.StreetAddress2}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        StreetAddress2: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col pb-2">
                            <Form.Label className="input-label">City</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.City}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        City: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">State</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.State}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        State: event.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-col pb-4">
                            <Form.Label className="input-label">Zip Code</Form.Label>
                            <Form.Control
                                className="input-gray"
                                value={projectInformation?.Zip}
                                onChange={(event) =>
                                    setProjectInformation({
                                        ...projectInformation,
                                        Zip: event.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="form-col pb-5"></div>

                        <div className="form-col">
                            <Form.Label className="input-label">Closing Date</Form.Label>
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

                        <div className="form-col pb-5"></div>
                    </div>
                </Form>

                <ClearChangesModal
                    show={showModal}
                    setShow={setShowModal}
                    clearChanges={clearChanges}
                />

                <CustomerModal
                    show={showCustomerModal}
                    setShow={handleShowCustomerModal}
                    setCustomer={setProjectInformation}
                    project={projectInformation}
                />

                <div className="d-flex justify-content-center pt-5">
                    {isLoading ? (
                        <Spinner animation="border" variant="primary"/>
                    ) : (
                        <>
                            {project?.ID ? (
                                projectInformation?.StatusID === -1 ?
                                    <>
                                        <Button
                                            variant="link"
                                            className="cancel"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={saveChanges}
                                            className="btn-danger next-btn ml-3"
                                        >
                                            Delete
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <Button
                                            variant="link"
                                            className="cancel"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={saveChanges}
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
                        </>
                    )}
                </div>
            </div>

            <MarketingBlock/>

        </div>

    );
});

export default withSwal(ProjectInformation);
