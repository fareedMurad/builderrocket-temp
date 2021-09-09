import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { getSubdivisions } from '../../actions/subdivisionActions';
import { saveProject, setSelectedProjectTab, uploadProjectThumbnail } from '../../actions/projectActions';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import './ProjectInformation.scss';

// components
import FileUpload from '../FileUpload';
import CustomerModal from '../CustomerModal';
import MarketingBlock from '../MarketingBlock';
import ClearChangesModal from '../ClearChangesModal';

const ProjectInformation = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const subdivisions = useSelector(state => state.subdivision.subdivisions);

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [projectInformation, setProjectInformation] = useState({
        ...project, 
        CloseDate: project?.CloseDate
    });

    useEffect(() => {
        dispatch(getSubdivisions());
    }, [dispatch]);

    const onFileChange = (event) => {
        // Save new thumbnail
        const formData = new FormData();

        formData.append('File', event.target?.files?.[0]);
        console.log('FORM DATA', formData);

        dispatch(uploadProjectThumbnail(project?.ID, formData));
    }

    const clearChanges = () => {
        setProjectInformation({
            ...project, 
            CloseDate: project?.CloseDate
        });

        setShowModal(false);
    }

    const handleShowCustomerModal = (bool) => {
        setShowCustomerModal(bool);
    }

    const saveChanges = () => {
        setIsLoading(true);

        const projectInformationFinal = {
            ...projectInformation,
            CloseDate: projectInformation?.CloseDate
        };

        // Save Project then navigate to documents tab
        dispatch(saveProject(projectInformationFinal))
            .then(() => {
                setIsLoading(false);
                dispatch(setSelectedProjectTab('documents'));
            });
    }

    const customerFullName = `${projectInformation?.Customers?.[0]?.FirstName} ${projectInformation?.Customers?.[0]?.LastName}`;

    console.log('project', projectInformation);

    return (
        <div className='d-flex project-information'> 
            <div className='information-form-container'> 
                <div className='page-title'>Project Information</div>

                <Form>
                    <div className='d-flex flex-wrap information-form'>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Project Name
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.ProjectName}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    ProjectName: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <FileUpload 
                                short 
                                label='Project Image' 
                                fileURL={projectInformation?.ThumbnailURL}
                                onFileChange={(event) => onFileChange(event)}
                                placeholder={projectInformation?.ThumbnailName}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Customer Name
                            </Form.Label>
                            <Form.Control
                                readOnly
                                className='input-gray'
                                value={customerFullName}
                                onClick={() => setShowCustomerModal(true)}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>Customer Email</Form.Label>
                            <Form.Control
                                readOnly
                                type='email'
                                className='input-gray'
                                onClick={() => setShowCustomerModal(true)}
                                value={projectInformation?.Customers?.[0]?.Email}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>Plan Name</Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.PlanName}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    PlanName: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Project Status
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.Status}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    Status: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-3 select'>
                            <Form.Label className='input-label'>
                                Subdivision
                            </Form.Label>
                            <Form.Control
                                as='select'
                                value={projectInformation?.Subdivision}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    Subdivision: event.target.value
                                })}
                            >
                                <option></option>
                                {subdivisions?.map((subdivision, index) => (
                                    <option 
                                        key={index}
                                        value={subdivision.SubdivisionName}
                                    >
                                        {subdivision.SubdivisionName}
                                    </option>
                                ))}
                            </Form.Control>
                        </div>

                        <div className='form-col pb-5'></div>

                        <div className='form-col pb-2'> 
                            <Form.Label className='input-label'>
                                Street Address 1
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.StreetAddress1}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    StreetAddress1: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Street Address2
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.StreetAddress2}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    StreetAddress2: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-2'>
                            <Form.Label className='input-label'>
                                City
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.City}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    City: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                State
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.State}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    State: event.target.value
                                })}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Zip Code
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                value={projectInformation?.Zip}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    Zip: event.target.value
                                })}
                            />
                        </div>

                        <div className='form-col pb-5'></div>

                        <div className='form-col'>
                            <Form.Label className='input-label'>
                                Closing Date
                            </Form.Label>
                            <DatePicker 
                                className='input-gray date-picker'
                                onChange={(date) => setProjectInformation({ ...projectInformation, CloseDate: date})}
                                selected={new Date(projectInformation?.CloseDate)}
                            />
                        </div>

                        <div className='form-col pb-5'></div>
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

                <div className='d-flex justify-content-center pt-5'>
                    {isLoading ? (
                        <Spinner 
                           animation='border'
                           variant='primary' 
                       />
                    ) : (
                        <>
                            <Button 
                                variant='link' 
                                className='cancel'
                                onClick={() => setShowModal(true)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={saveChanges}
                                className='primary-gray-btn next-btn ml-3'
                            >
                                Next
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <MarketingBlock />
        </div>
    )
}

export default ProjectInformation;