import React, { useEffect } from 'react';
import { Form, Col } from 'react-bootstrap';
import { getSubdivisions } from '../../actions/subdivisionActions';
import { useDispatch, useSelector } from 'react-redux';
import './ProjectInformation.scss';
import Utils from '../../utils';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const ProjectInformation = (props) => {
    const { project } = props;

    const dispatch = useDispatch();

    const subdivisions = useSelector(state => state.subdivision.subdivisions);

    useEffect(() => {
        dispatch(getSubdivisions());
    }, [dispatch]);

    return (
        <div className='d-flex project-information'> 
            <div className='information-form-container'> 
                <div className='page-title'>Project Information</div>

                <div className='d-flex information-form'>
                    <Col>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Project Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.ProjectName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Customer Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.Customers?.[0]?.FirstName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Plan Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.PlanName}
                            />
                        </div>
                        <div className='pb-2 select'>
                            <Form.Label className='input-label'>Subdivision</Form.Label>
                            <Form.Control as='select'>
                                <option></option>
                                {subdivisions?.map((subdivision, index) => (
                                    <option key={index}>{subdivision.SubdivisionName}</option>
                                ))}
                            </Form.Control>
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Street Address 1</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.StreetAddress1}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>City</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.City}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Zip Code</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.Zip}
                            />
                        </div>
                        <div>
                            <Form.Label className='input-label'>Closing Date</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={Utils.formatDateDashes(project?.CloseDate)}
                            />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-4'>
                            <FileUpload label='Project Image' short />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Customer Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.Customers?.[0]?.Email}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Project Status</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-5'></div>
                        <div className='pb-2 pt-2'>
                            <Form.Label className='input-label'>Street Address2</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.StreetAddress2}
                            />
                        </div>

                        <div className='pb-4'>
                            <Form.Label className='input-label'>State</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.State}
                            />
                        </div>
                    </Col>
                </div>

                <div className='d-flex justify-content-center pt-5'>
                    <a href='/' className='cancel'>Cancel</a>
                    <button className='primary-gray-btn next-btn ml-3'>Next</button>
                </div>
            </div>

            <MarketingBlock />
        </div>
    )
}

export default ProjectInformation;