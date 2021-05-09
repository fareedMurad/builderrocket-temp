import React from 'react';
import { Form, Col } from 'react-bootstrap';
import Utils from '../../utils';
import './ProjectInformation.scss';

// components
import MarketingBlock from '../MarketingBlock';
import FileUpload from '../FileUpload';

const ProjectInformation = (props) => {
    const { project } = props;

    return (
        <div className='d-flex project-information'> 
            <div className='information-form-container'> 
                <div id='title'>Project Information</div>

                <div className='d-flex information-form'>
                    <Col>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Project Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.projectName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Customer Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.customers?.[0]?.firstName}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Plan Name</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.planName}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Subdivision</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Street Address 1</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.streetAddress1}
                            />
                        </div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>City</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.city}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Zip Code</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.zip}
                            />
                        </div>
                        <div>
                            <Form.Label className='input-label'>Closing Date</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={Utils.formatDateDashes(project?.closeDate)}
                            />
                        </div>
                    </Col>

                    <Col>
                        <div className='pb-4'>
                            <FileUpload />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Customer Email</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                value={project?.customers?.[0]?.email}
                            />
                        </div>
                        <div className='pb-4'>
                            <Form.Label className='input-label'>Project Status</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                            />
                        </div>
                        <div className='pb-5 pt-3'></div>
                        <div className='pb-2'>
                            <Form.Label className='input-label'>Street Address2</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.streetAddress2}
                            />
                        </div>

                        <div className='pb-4'>
                            <Form.Label className='input-label'>State</Form.Label>
                            <Form.Control
                                type='email'
                                className='input-gray'
                                defaultValue={project?.state}
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