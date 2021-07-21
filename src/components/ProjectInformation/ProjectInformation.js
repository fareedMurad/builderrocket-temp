import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { getSubdivisions } from '../../actions/subdivisionActions';
import { saveProject } from '../../actions/projectActions';
import { useDispatch, useSelector } from 'react-redux';
import './ProjectInformation.scss';
import Utils from '../../utils';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const ProjectInformation = (props) => {
    const dispatch = useDispatch();

    const project = useSelector(state => state.project.project);
    const subdivisions = useSelector(state => state.subdivision.subdivisions);

    const [projectInformation, setProjectInformation] = useState(project);

    useEffect(() => {
        dispatch(getSubdivisions());
    }, [dispatch]);

    const clearChanges = () => {
        setProjectInformation(project);
    }

    const saveChanges = () => {
        dispatch(saveProject(projectInformation));
    }
    
    // console.log('updatedProject', projectInformation, subdivisions);

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
                                label='Project Image' 
                                short 
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>
                                Customer Name
                            </Form.Label>
                            <Form.Control
                                className='input-gray'
                                defaultValue={projectInformation?.Customers?.[0]?.FirstName}
                            />
                        </div>
                        <div className='form-col pb-4'>
                            <Form.Label className='input-label'>Customer Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={projectInformation?.Customers?.[0]?.Email}
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
                            <Form.Control
                                className='input-gray'
                                value={Utils.formatDateDashes(projectInformation?.CloseDate)}
                                onChange={(event) => setProjectInformation({
                                    ...projectInformation,
                                    CloseDate: event.target.value
                                })}
                            />
                        </div>

                        <div className='form-col pb-5'></div>
                    </div>
                </Form>

                <div className='d-flex justify-content-center pt-5'>
                    <Button 
                        variant='link' 
                        className='cancel'
                        onClick={clearChanges}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={saveChanges}
                        className='primary-gray-btn next-btn ml-3'
                    >
                        Next
                    </Button>
                </div>
            </div>

            <MarketingBlock />
        </div>
    )
}

export default ProjectInformation;